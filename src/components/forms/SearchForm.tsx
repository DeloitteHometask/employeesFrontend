import React, { useEffect, useRef, useState } from "react";
import Employee from "../../model/Employee";
import EmployeeCard from "../cards/EmployeeCard";
import Modal from "../common/Modal";
import DropdownList from "../common/DropdownList";
import InputResult from "../../model/InputResult";
import '../../styles/Spinner.css'
import { employeesService } from "../../config/service-config";

const PAGE_DATA_SIZE = 10;

type Props = {
    submitFn: (pattern: String, page: number, pageSize: number) => Promise<InputResult>
    employees: Employee[]
}
const workTitle: any = null;

const initialEmployee: Employee = {
    id: 0, name: '', workTitle, imageUrl: ''
};

export const SearchForm: React.FC<Props> = ({ submitFn, employees }) => {
    const [employee, setEmployee] = useState<Employee>(initialEmployee);
    const [foundEmployees, setFoundEmployees] = useState<Employee[]>([]);
    const [prevFoundEmployees, setPrevFoundEmployees] = useState<Employee[]>([]);
    const [isHiddenList, setIsHiddenList] = useState<boolean>(true);
    const [openDetails, setOpenDetails] = useState<boolean>(false);
    const [pattern, setPattern] = useState<string>('');
    const pageNumber = useRef<number>(1);
    const [hasMore, setHasMore] = useState(true);
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

    const loadMore = () => {
        pageNumber.current++;
    }
    useEffect(() => {
        const timer = setTimeout(() => {
          setIsWebSocketConnected(true);
        }, 1000);
      
        return () => {
          clearTimeout(timer);
        };
      }, []);

    useEffect(() => {
        if (pageNumber.current !== 1 && hasMore) {
            setPrevFoundEmployees(foundEmployees);
            getNewPartition();
        }
    }, [pageNumber.current]);

    const getNewPartition = async () => {
        await submitFn(pattern, pageNumber.current, PAGE_DATA_SIZE);
    };

    useEffect(() => {
        if (prevFoundEmployees.length > 0 && employees.length === prevFoundEmployees.length) {
            setHasMore(false);
        }
    }, [employees]);

    useEffect(() => {
        setFoundEmployees(employees);
    }, [employees]);

    useEffect(() => {
        setPrevFoundEmployees([]);
        pageNumber.current = 1;
        setHasMore(true);
    }, [pattern]);

    function handlerPattern(event: React.ChangeEvent<HTMLInputElement>) {
        setPattern(event.target.value);
    }

    async function onInputFocus() {
        await submitFn(pattern, pageNumber.current, PAGE_DATA_SIZE);
        setIsHiddenList(false);
    }
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmitFn(event: any) {
        event.preventDefault();
        setIsLoading(true);
        await submitFn(pattern, pageNumber.current, PAGE_DATA_SIZE);
        setIsLoading(false);
        setIsHiddenList(false);
    }

    function onClickFn(employee: Employee) {
        setEmployee(employee);
        setOpenDetails(true);
    }

    function highlightMatchingLetters(text: string, pattern: string) {
        const lowerPattern = pattern.toLowerCase();
        const regex = new RegExp(`(${lowerPattern})`, "gi");
        return text.split(regex).map((part, index) => (
            <span
                key={index}
                style={{
                    backgroundColor: part.toLowerCase() === lowerPattern ? "yellow" : "transparent",
                }}
            >
                {part}
            </span>
        ));
    }

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (document.getElementById('search-field') && !document.getElementById('search-field')!.contains(event.target) &&
                document.getElementById('search-button') && !document.getElementById('search-button')!.contains(event.target) &&
                document.getElementById('employees-list') && !document.getElementById('employees-list')!.contains(event.target) &&
                (!(document.getElementById('load-more-button') && !document.getElementById('load-more-button')!.contains(event.target))
                    ||
                    (document.getElementById('load-more-button') && !document.getElementById('load-more-button')!.contains(event.target))) &&
                !(openDetails && document.getElementById('employee-card')!.contains(event.target))) {
                setIsHiddenList(true);
                setPattern('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDetails]);

    return (
        <div style={{ marginTop: "27vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <form onSubmit={onSubmitFn} className="employees-search">
                <div id="employees-search" className="employees-search">
                    <div style={{ textAlign: "center", width: "100%" }} className="employees-search-header">
                        LOOKING FOR AN EMPLOYEE?
                    </div>
                    <div style={{ textAlign: "center", width: "100%" }}>
                        <label htmlFor="pattern" >
                            Click on the search bar to learn our suggestions
                        </label>
                    </div>
                    <div id="search-field" className="search-field">
                        <input
                            className="search-input"
                            id="pattern"
                            type="text"
                            placeholder="Search..."
                            onFocus={onInputFocus}
                            onChange={handlerPattern}
                            value={pattern}
                        />
                        <div id="search-button" style={{ marginLeft: "10px", display: "inline-block" }} >
                            <button type="submit" className="search-button"></button>
                        </div>
                    </div>
                    {!isHiddenList &&
                        <DropdownList onClose={() => setIsHiddenList(true)}>
                            <div id="employees-list" className="employees-list">
                                {foundEmployees.map(e => (
                                    <a id={`employee-info-${e.id}`} key={e.id} onClick={() => onClickFn(e)}>
                                        <div className="employee-info">
                                            <span className="employee-image"
                                                style={{
                                                    backgroundImage: `url(${e.imageUrl})`,
                                                    display: 'block',
                                                }}
                                            ></span>
                                            <div className="employee-info-text">
                                                <span className="employee-name">
                                                    {pattern.length > 1 ? highlightMatchingLetters(e.name, pattern)
                                                        : e.name}
                                                </span>
                                                <span className="employee-workTitle">
                                                    {pattern.length > 1 ? highlightMatchingLetters(e.workTitle.workTitle, pattern)
                                                        : e.workTitle.workTitle}
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                                {pattern != "" && (
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <button
                                            key={"load-more-button"}
                                            onClick={loadMore}
                                            id='load-more-button'
                                            className={`load-more-button employee-info ${!hasMore ? 'disabled-button' : ''}`}
                                            style={{ justifyContent: "center", textAlign: 'center' }}
                                            disabled={!hasMore}>
                                            Load more
                                        </button>
                                    </div>
                                )}
                            </div>
                        </DropdownList>
                    }
                </div>
            </form>
            {openDetails && (
                <div id="employee-card">
                    <Modal onClose={() => setOpenDetails(false)}>

                        <EmployeeCard employee={employee} />

                    </Modal>
                </div>

            )}
            {(!isWebSocketConnected || isLoading) && (
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            )}
        </div>

    );
}

    // useEffect(() => {
    //     const checkWebSocketConnection = () => {
    //       const isConnected = employeesService.isConnectedToWebSocket();
    //       setIsWebSocketConnected(isConnected);
    //     };
    //     checkWebSocketConnection();      
    //   }, []);

    //   useEffect(() => {
    //     if(!isWebSocketConnected)
    //     setIsWebSocketConnected(true);
    //   }, [isWebSocketConnected]);