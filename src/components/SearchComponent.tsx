import React, { useEffect, useState } from "react";
import classNames from "classnames";

const API_URL = './AGENTS_LIST.json';
const MAX_RESULTS = 3;

enum Gender {
    Female = "FEMALE",
    Male = "MALE",
}

type Agent = {
    "id": number,
    "name": string,
    "avatar": string,
    "income": number,
    "gender": Gender
}

export function SearchComponent() {

    const [agents, setAgents] = useState<Agent[]>([]);
    const [income, setIncome] = useState<number>();
    const [showResult, setShowResults] = useState(false);
    
    // useEffect(() => {
        //     fetchData();
        // }, [])
        
    const search = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const showData = async () => {
            setShowResults(true);
            const data = await fetch(API_URL);
            const json: Agent[] = await data.json();
            if (typeof income === "number") {
                let agents = json.filter((agent) => {
                    return agent.income < income + 10000 && agent.income > income - 10000
                }).sort((agentA: Agent, agentB: Agent) => {
                    return (income - agentB.income) - (income - agentA.income) ;
                }).slice(0, MAX_RESULTS);
            
                setAgents(agents);
            }
        }
        showData();
    }

    const changeOrder = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let [prop, newOrderDir] = event.target.value.split('|');
        let orderedAgents = agents.concat([]).sort((agentA: any, agentB: any) => {
            if (typeof agentA[prop] === "number") {
                return agentA[prop] - agentB[prop];
            } else {
                console.log(agentA[prop].toString().charCodeAt(0), agentB[prop].toString().charCodeAt(0), agentA, agentB)
                return agentA[prop].toString().charCodeAt(0) - agentB[prop].toString().charCodeAt(0)
            }
        })
        if (newOrderDir === "asc") {
            orderedAgents = orderedAgents.reverse();
        }
        console.log(orderedAgents);
        setAgents(orderedAgents);
        console.log(orderedAgents);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIncome(parseInt(event.target.value, 10));
    }

    if (!showResult) {
        // Initial Search view
        return (
            <div className="search-form">
                <svg className="logo" width="90" height="64" viewBox="0 0 90 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 27.5C18.4641 27.5 22.5 23.4641 22.5 18.5C22.5 13.5359 18.4641 9.5 13.5 9.5C8.53594 9.5 4.5 13.5359 4.5 18.5C4.5 23.4641 8.53594 27.5 13.5 27.5ZM76.5 27.5C81.4641 27.5 85.5 23.4641 85.5 18.5C85.5 13.5359 81.4641 9.5 76.5 9.5C71.5359 9.5 67.5 13.5359 67.5 18.5C67.5 23.4641 71.5359 27.5 76.5 27.5ZM81 32H72C69.525 32 67.2891 32.9984 65.6578 34.6156C71.325 37.7234 75.3469 43.3344 76.2188 50H85.5C87.9891 50 90 47.9891 90 45.5V41C90 36.0359 85.9641 32 81 32ZM45 32C53.7047 32 60.75 24.9547 60.75 16.25C60.75 7.54531 53.7047 0.5 45 0.5C36.2953 0.5 29.25 7.54531 29.25 16.25C29.25 24.9547 36.2953 32 45 32ZM55.8 36.5H54.6328C51.7078 37.9062 48.4594 38.75 45 38.75C41.5406 38.75 38.3063 37.9062 35.3672 36.5H34.2C25.2563 36.5 18 43.7563 18 52.7V56.75C18 60.4766 21.0234 63.5 24.75 63.5H65.25C68.9766 63.5 72 60.4766 72 56.75V52.7C72 43.7563 64.7438 36.5 55.8 36.5ZM24.3422 34.6156C22.7109 32.9984 20.475 32 18 32H9C4.03594 32 0 36.0359 0 41V45.5C0 47.9891 2.01094 50 4.5 50H13.7672C14.6531 43.3344 18.675 37.7234 24.3422 34.6156Z" fill="#747D9B"/>
                </svg>

                <h1>Find the best agent for you!</h1>
                <h2>Fill the information below to get your matches.</h2>
                <form onSubmit={search}>
                    <label htmlFor="current-income">Current income:</label>
                    <input id="current-income" type="number" maxLength={5} minLength={5} defaultValue={income?.toString()} onChange={handleChange} />
                    <button type="submit">Get Matches</button>
                </form>
            </div>
        )
    } else {
        // Results Listing view
        return (
        agents.length ?
            <div className="results">
                <h1>Your Matches</h1>
                <h2>Your Income: ${income}</h2>
                <div className="order-container">
                    <div className="order-by-label">Order agents by</div>
                    <select name="" onChange={changeOrder} id="">
                        <option value="id">ID</option>
                        <option value="name">Name</option>
                        <option value="income">Income: High first</option>
                        <option value="income|asc">Income: Low first</option>
                    </select>
                </div>
                <div className="profiles">
                    {agents.map((agent: Agent) =>
                        <div key={agent.id} className={classNames({[agent.gender]: true, 'profile': true})}>
                            <div className="avatar-container">
                                <img width="112" alt="Profile pic" src={agent.avatar} />
                            </div>
                            <h1>{agent.name}</h1>
                            <h2>ID: {agent.id}</h2>
                            <div className="income">Income <strong>${agent.income}</strong></div>
                        </div>
                    )}
                </div>
            </div>
            :
            <div>No available Agents based on your income. Please try a different income value.</div>
        )
    }
}
