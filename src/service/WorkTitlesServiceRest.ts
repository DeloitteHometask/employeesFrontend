import { CompatClient, Stomp } from "@stomp/stompjs";
import { Observable, Subscriber } from "rxjs";
import WorkTitle from "../model/WorkTitle";
import { AUTH_DATA_JWT } from "./AuthServiceJWT";
import WorkTitlesService from "./WorkTitlesService";
const TOPIC: string = "/topic/worktitles";

async function getResponseText(response: Response): Promise<string> {
    let res = '';
    if (!response.ok) {
        const { status } = response;
        res = status === 401 || status === 403 ? 'Authentication' : await response.text();
    }
    return res;
} 

function getHeaders(): HeadersInit {
    const res: HeadersInit = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(AUTH_DATA_JWT) || ''}`
    }
    return res;
}

async function fetchRequest(url: string, options: RequestInit, wt?: WorkTitle): Promise<Response> {
    options.headers = getHeaders();
    if (wt) {
        options.body = JSON.stringify(wt);
    }
    let flUpdate = true;
    let responseText = '';
    try {
        const response = await fetch(url, options);
        responseText = await getResponseText(response);
        if (responseText) {
            throw responseText;
        }
        return response;
    } catch (error: any) {
        if (!flUpdate) {
            throw error;
        }
        throw responseText ? responseText : "Server is unavailable. Repeat later on";
    }
}

async function fetchAllWorkTitles(url: string): Promise<WorkTitle[] | string> {
    const response = await fetchRequest(url, {});
    return await response.json()
}

export default class WorkTitlesServiceRest implements WorkTitlesService {
    private observable: Observable<WorkTitle[] | string> | null = null;
    private subscriber: Subscriber<string | WorkTitle[]> | undefined;
    private urlService: string;
    private urlWebSocket: string;
    private stompClient: CompatClient;
    private cache: Map<String, WorkTitle>;

    constructor(baseUrl: string) {
        this.urlService = `http://${baseUrl}/company/worktitles`;
        this.urlWebSocket = `ws://${baseUrl}/websocket/company`;
        this.stompClient = Stomp.client(this.urlWebSocket);
        this.cache = new Map();
    }

    async addWorkTitle(wt: WorkTitle): Promise<WorkTitle> {
        const response = await fetchRequest(this.urlService, {
            method: 'POST',
        }, wt);
        return response.json();
    }

    getWorkTitles(): Observable<WorkTitle[] | string> {
        if (!this.observable) {
            this.observable = new Observable<WorkTitle[] | string>(subscriber => {
                this.subscriber = subscriber;
                this.subscriberNext();
                this.connectWebSocket();
                return () => this.disconnectWebSocket()
            })
        }
        return this.observable;
    }

    private subscriberNext(): void {
        fetchAllWorkTitles(this.urlService).then(worktitles => {
            if (this.cache.size === 0 && worktitles instanceof Object) {
                console.log("Cache was updated");
                worktitles.forEach(wt => this.cache.set(wt.workTitle, wt))
            }
            this.subscriber?.next(Array.from(this.cache.values()));
        }).catch(error => this.subscriber?.next(error));
    }

    private connectWebSocket() {
        this.stompClient.connect(
            {},
            () => {
                this.stompClient.subscribe(TOPIC, message => {
                    const data: any = JSON.parse(message.body);
                    data.operation === "delete" ? this.cache.delete(data.payload.id) : this.cache.set(data.payload.id, data.payload)
                    this.subscriberNext();
                });
            },
            (error: any) => this.subscriber?.next(JSON.stringify(error)),
            () => console.log("websocket disconnect"));
    }

    private disconnectWebSocket(): void {
        this.stompClient?.disconnect();
        this.cache.clear();
    }
}