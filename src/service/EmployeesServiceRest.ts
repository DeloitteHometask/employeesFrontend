import { Observable, Subscriber } from "rxjs";
import Employee from "../model/Employee";
import { AUTH_DATA_JWT } from "./AuthServiceJWT";
import EmployeesService from "./EmployeesService";
import { CompatClient, Stomp } from "@stomp/stompjs";
const TOPIC: string = "/topic/employees";

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

async function fetchRequest(url: string, options: RequestInit, empl?: any): Promise<Response> {
    options.headers = getHeaders();
    if (empl) {
        options.body = JSON.stringify(empl);
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

async function fetchAllEmployees(url: string): Promise<Employee[] | string> {
    const response = await fetchRequest(url + "/sorted", {});
    return await response.json()
}

export default class EmployeesServiceRest implements EmployeesService {
    private observable: Observable<Employee[] | string> | null = null;
    private subscriber: Subscriber<string | Employee[]> | undefined;
    private urlService: string;
    private urlWebSocket: string;
    private stompClient: CompatClient;
    private cache: Map<number, Employee>;

    constructor(baseUrl: string) {
        this.urlService = `https://${baseUrl}/company/employees`;
        this.urlWebSocket = `wss://${baseUrl}/websocket/company`;
        this.stompClient = Stomp.client(this.urlWebSocket);
        this.cache = new Map();
    }

    async addEmployee(empl: Employee): Promise<Employee> {
        const employee = { ...empl, workTitle: empl.workTitle.workTitle };
        const response = await fetchRequest(this.urlService, {
            method: 'POST',
        }, employee);
        return response.json();
    }

    getEmployees(): Observable<Employee[] | string> {
        if (!this.observable) {
            this.observable = new Observable<Employee[] | string>(subscriber => {
                this.subscriber = subscriber;
                this.subscriberNext();
                this.connectWebSocket();
                return () => this.disconnectWebSocket()
            })
        }
        return this.observable;
    }

    private subscriberNext(): void {
        fetchAllEmployees(this.urlService).then(employees => {
            if ((this.cache.size === 0 && employees instanceof Object) ||
                (employees instanceof Object)) {
                employees.forEach(e => this.cache.set(e.id, e))
            }
            this.subscriber?.next(Array.from(this.cache.values()));
        }).catch(error => this.subscriber?.next(error));
    }

    connectWebSocket() {
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

    isConnectedToWebSocket(): boolean {
        return this.stompClient?.connected || false;
    }

    async findEmployeesByPattern(pattern: string, page: number, size: number = 10): Promise<Employee[]> {
        const patternUrl = `${this.urlService}/sorted/${pattern}?page=${page}&size=${size}`;
        const response = await fetchRequest(patternUrl, { method: 'GET' });
        return response.json();
    }
}

