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
    const [income, setIncome] = useState<number>(0);
    const [showResult, setShowResults] = useState(false);
    const [order, setOrder] = useState<string>("asc");
    
    // useEffect(() => {
        //     fetchData();
        // }, [])
        
    const search = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setShowResults(true);
        const data = await fetch(API_URL);
        const json: Agent[] = await data.json();
        console.log(json);
        let agents = json.filter((agent) => {
            return agent.income < income + 10000 && agent.income > income - 10000
        }).sort((agentA: Agent, agentB: Agent) => {
            return (income - agentB.income) - (income - agentA.income) ;
        }).slice(0, MAX_RESULTS);
    
        setAgents(agents);
    }

    const changeOrder = (col: any) => {
        setOrder(order === "asc" ? "desc" : "asc");
        let orderedAgents = agents.sort((agentA: any, agentB: any) => {
            if (typeof agentA[col] === "number") {
                return agentA[col] - agentB[col];
            } else {
                console.log(agentA[col].toString().charAt(0), agentB[col].toString().charAt(0), agentA, agentB)
                return agentA[col].toString().charAt(0) - agentB[col].toString().charAt(0)
            }
        })
        if (order === "asc") {
            orderedAgents = orderedAgents.reverse();
        }
        setAgents(orderedAgents);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIncome(parseInt(event.target.value, 10));
    }

    return (
        <div>
            {
                showResult ?
                    agents.length ?
                        <div className="search">   
                        <button onClick={() => changeOrder('id')}>Ordery by ID</button>
                        <button onClick={() => changeOrder('name')}>Ordery by name</button>
                        <button onClick={() => changeOrder('income')}>Ordery by income</button>
                        {agents.map((agent: Agent) =>
                            <div key={agent.id} className={classNames({[agent.gender]: true, 'profile': true})}>
                                <div>{agent.id}</div>
                                <div>{agent.name}</div>
                                <div className="avatar-container">
                                    <img width="150" src={agent.avatar} />
                                </div>
                                <div>${agent.income}</div>
                            </div>
                        )}
                        </div>
                    :
                        <div>
                        No available Agents based on your income. Please try a different income value.
                        </div>
                :
                    <div className="results">
                        <form action="" onSubmit={search}>
                            <input type="number" maxLength={5} minLength={5} defaultValue={income?.toString()} onChange={handleChange} />
                            <button type="submit">MATCH</button>
                        </form>
                    </div>
            }
        </div>
    )
}
