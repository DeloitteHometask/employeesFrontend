import React, { useEffect, useRef, useState } from "react";
import Employee from "../../model/Employee";
import EmployeeCard from "../cards/EmployeeCard";
import Modal from "../common/Modal";
import DropdownList from "../common/DropdownList";

type Props = {
    submitFn: (pattern: String) => Promise<Employee[]>
}
const workTitle: any = null;

const initialEmployee: Employee = {
    id: 0, name: '', workTitle, imageUrl: ''
};

export const SearchForm: React.FC<Props> = ({ submitFn }) => {
    const [employee, setEmployee] = useState<Employee>(initialEmployee);
    const [errorMessage, setErrorMessage] = useState('');
    const [foundEmployees, setFoundEmployees] = useState<Employee[]>([]);
    const [isHiddenList, setIsHiddenList] = useState<boolean>(true);
    const [openDetails, setOpenDetails] = useState<boolean>(false);
    const [pattern, setPattern] = useState<string>('');

    function handlerPattern(event: React.ChangeEvent<HTMLInputElement>) {
        setPattern(event.target.value);
    }

    async function onInputFocus() {
        console.log("I touched it");
        const res = await submitFn(pattern);
        setFoundEmployees(res);
        setIsHiddenList(false);
    }

    async function offInputFocus() {
        setPattern("");
        const res = await submitFn(pattern);
        setFoundEmployees(res);
        setIsHiddenList(true);
    }

    useEffect(() => {
    }, [isHiddenList, foundEmployees]);

    async function onSubmitFn(event: any) {
        event.preventDefault();
        const res = await submitFn(pattern);
        setFoundEmployees(res);
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

    return (
        <div style={{
            marginTop: "27vh", alignItems: "center", justifyContent: "center", display: "flex"
        }}>
            <form onSubmit={onSubmitFn}>
                <div id="employees-search" className="employees-search">
                    <div style={{ textAlign: "center", width: "100%" }} className="employees-search-header">
                        LOOKING FOR AN EMPLOYEE?
                    </div>
                    <div style={{ textAlign: "center", width: "100%" }}>
                        <label htmlFor="pattern" >
                            Click on the search bar to learn our suggestions
                        </label>
                    </div>
                    <div style={{ flexDirection: "row", marginTop: "1vh", alignItems: "center", justifyContent: "center" }}>
                        <input
                            className="search-input"
                            id="pattern"
                            type="text"
                            placeholder="Search..."
                            onFocus={onInputFocus}
                            onChange={handlerPattern}
                            value={pattern}
                        />
                        <div style={{ marginLeft: "10px", display: "inline-block" }} >
                            <button type="submit" className="search-button"></button>
                        </div>
                    </div>
                    {!isHiddenList &&
                        <DropdownList onClose={() => setIsHiddenList(true)}>
                            <div id="employees-list" className="employees-list">
                                {foundEmployees.map(e => (
                                    <a key={e.id} onClick={() => onClickFn(e)}>
                                        <div className="employee-info">
                                            <span className="employee-image"
                                                style={{
                                                    backgroundImage: `url(${e.imageUrl})`,
                                                    display: 'block',
                                                }}
                                            ></span>
                                            <div className="employee-info-text">
                                                <span className="employee-name">
                                                    {pattern.length >1 ? highlightMatchingLetters(e.name, pattern)
                                                        : e.name}
                                                </span>
                                                <span className="employee-workTitle">
                                                    {pattern.length >1 ? highlightMatchingLetters(e.workTitle.workTitle, pattern)
                                                        : e.workTitle.workTitle}                                        </span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </DropdownList>
                    }
                </div>

            </form>
            {openDetails && (
                <Modal onClose={() => setOpenDetails(false)}>
                    <EmployeeCard employee={employee} />
                </Modal>
            )}
        </div>
    );
}

    // useEffect(() => {
    //     function handleClickOutside(event: MouseEvent) {
    //         if (
    //             patternRef.current &&
    //             employeesListRef.current &&
    //             !patternRef.current.contains(event.target as Node) &&
    //             !employeesListRef.current.contains(event.target as Node)
    //         ) {
    //             handleOutsideClick();
    //         }
    //     }
    //     document.addEventListener("click", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("click", handleClickOutside);
    //     };
    // }, []);

// (
//     <div style={{ marginTop: "25vh" }}>
//         <form onSubmit={onSubmitFn}>
//             <div id="employees-search" className="employees-search">
//                 <label htmlFor="pattern">Click on the search bar to learn our suggestions</label>
//                 <input
//                     id="pattern"
//                     type="text"
//                     placeholder="Search..."
//                     onFocus={onInputFocus}
//                     onChange={handlerPattern}
//                     value={pattern}
//                     style={{ paddingRight: '50px' }} // Make room for the search button
//                 />
//                 <button type="submit" className="search-button">Button</button>

//                 <div id="employees-list" className="employees-list" hidden={openList}>
//                     {foundEmployees.map(e => (
//                         <a key={e.id} onClick={() => onClickFn(e)}>
//                             <div className="employee-info">
//                                 <span className="employee-image"
//                                     style={{
//                                         width: 90,
//                                         height: 90,
//                                         backgroundImage: `url(${e.imageUrl})`,
//                                         display: 'block',
//                                     }}
//                                 ></span>
//                                 <span className="employee-name">{e.name}</span>
//                                 <span className="employee-workTitle">{e.workTitle}</span>
//                             </div>
//                         </a>
//                     ))}
//                 </div>
//             </div>
//         </form>
//         {openDetails && (
//             <div id="employee-details" className="employee-details">
//                 <EmployeeCard employee={employee}></EmployeeCard>
//             </div>
//         )}
//     </div>
// );