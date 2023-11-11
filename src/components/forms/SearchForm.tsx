import React, { useState } from "react";
import { useSelectorWorkTitles } from "../../hooks/hooks";
import Employee from "../../model/Employee";
import EmployeeCard from "../cards/EmployeeCard";

type Props = {
    submitFn: (pattern: String) => Promise<Employee[]>,
}

const initialEmployee: Employee = {
    id: 0, name: '', workTitle: '', imageUrl: ''
};

export const SearchForm: React.FC<Props> = ({ submitFn }) => {
    const workTitles = useSelectorWorkTitles();
    const [employee, setEmployee] = useState<Employee>(initialEmployee);
    const [errorMessage, setErrorMessage] = useState('');
    const [foundEmployees, setFoundEmployees] = useState<Employee[]>([]);
    const [openList, setOpenList] = useState<boolean>(false);
    const [openDetails, setOpenDetails] = useState<boolean>(false);

    const [pattern, setPattern] = useState<string>('');

    // function handlerPattern(event: any) {
    //     const inputElement = event.target as HTMLInputElement;
    //     const focused = document.activeElement === inputElement;
    //     if (focused) {
    //         setOpenList(true);
    //     }
    //     setPattern(event.target.value);
    // }

    function handlerPattern(event: React.ChangeEvent<HTMLInputElement>) {
        setPattern(event.target.value);
    }

    async function onInputFocus() {
        const res = await submitFn(pattern);
        setFoundEmployees(res);
        setOpenList(true);
    }

    async function onSubmitFn(event: any) {
        event.preventDefault();
        const res = await submitFn(pattern);
        setFoundEmployees(res);
    }

    // function onResetFn(event: any) {
    //     setPattern('');
    // }

    // function onClickFn(event: any) {
    //     const empl = event.target.value;
    //     setEmployee(empl);
    //     setOpenDetails(true);
    // }

    function onClickFn(employee: Employee) {
        setEmployee(employee);
        setOpenDetails(true);
        setOpenList(false);
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
                    <div id="employees-list" className="employees-list" hidden={!openList}>
                        {foundEmployees.map(e => (
                            <a key={e.id} onClick={() => onClickFn(e)}>
                                <div className="employee-info">
                                    <span className="employee-image"
                                        style={{
                                            width: 90,
                                            height: 90,
                                            backgroundImage: `url(${e.imageUrl})`,
                                            display: 'block',
                                        }}
                                    ></span>
                                    <span className="employee-name">{e.name}</span>
                                    <span className="employee-workTitle">{e.workTitle}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

            </form>
            {openDetails && (
                <div id="employee-details" className="employee-details" hidden={openDetails}>
                    <EmployeeCard employee={employee}></EmployeeCard>
                </div>
            )}
        </div>
    );
}



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