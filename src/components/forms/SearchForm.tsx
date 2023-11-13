import React, { useEffect, useRef, useState } from "react";
import Employee from "../../model/Employee";
import EmployeeCard from "../cards/EmployeeCard";
import Modal from "../common/Modal";
import DropdownList from "../common/DropdownList";
import InputResult from "../../model/InputResult";

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
    const [pageNumber, setPageNumber] = useState<number>(1);
    const pageSize = 10;
    const [hasMore, setHasMore] = useState(true);

    const fetchEmployees = async () => {
        setPrevFoundEmployees(foundEmployees);
        await getNewEmployees();
    };

    const getNewEmployees = async () => {
        await submitFn(pattern, pageNumber, pageSize);
        if (foundEmployees.length === 0) {
            setHasMore(false); // Если пришел пустой ответ, прекращаем загрузку
        } else {
            setFoundEmployees([...prevFoundEmployees, ...foundEmployees]);
        }
    };

    console.log("hasmore = " + hasMore);

    // const fetchEmployees = async () => {
    //     const newEmployees = await submitFn(pattern, pageNumber, pageSize);
    //     if (newEmployees.length === 0) {
    //         setHasMore(false); // Если пришел пустой ответ, прекращаем загрузку
    //     } else {
    //         setFoundEmployees(prev => [...prev, ...newEmployees]); // Добавляем новые данные
    //     }
    // };

    const loadMore = () => {
        setPageNumber(prev => prev + 1);
    };

    useEffect(() => {
        if (pageNumber === 1 || hasMore) {
            fetchEmployees();
        }
    }, [pageNumber]);



    function handlerPattern(event: React.ChangeEvent<HTMLInputElement>) {
        setPattern(event.target.value);
    }

    async function onInputFocus() {
        const res = await submitFn(pattern, pageNumber, pageSize);
        setIsHiddenList(false);
    }

    useEffect(() => {
        setFoundEmployees(employees);
    }, [employees]);

    useEffect(() => {
        setPageNumber(1);
    })

    async function onSubmitFn(event: any) {
        event.preventDefault();
        const res = await submitFn(pattern, pageNumber, pageSize);
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
        setPageNumber(1);
        setPrevFoundEmployees([]);
    }, [pattern]);



    // useEffect(() => {
    //     const handleClickOutside = (event: any) => {
    //         if (!document.getElementById('search-field')!.contains(event.target) ||
    //             (document.getElementById('search-button') && !document.getElementById('search-button')!.contains(event.target)) ||
    //             (!isHiddenList && !document.getElementById('employees-list')!.contains(event.target)) ||
    //             (!isHiddenList && !document.getElementById('employees-info')!.contains(event.target)) ||
    //             (openDetails && !document.getElementById('employee-card')!.contains(event.target))) {
    //             setIsHiddenList(true);
    //             setPattern('');
    //         }
    //     };
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (document.getElementById('search-field') && !document.getElementById('search-field')!.contains(event.target) &&
                document.getElementById('search-button') && !document.getElementById('search-button')!.contains(event.target) &&
                document.getElementById('employees-list') && !document.getElementById('employees-list')!.contains(event.target) &&
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
                                    <a id="employee-info" key={e.id} onClick={() => onClickFn(e)}>
                                        <div id="employee-info" className="employee-info">
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
                                {hasMore && (
                                    <div>
                                        <button onClick={loadMore} style={{ color: "white" }} className="load-more-button">
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
        </div>
    );
}