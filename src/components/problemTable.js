import React, { Component } from 'react';
import './problemTable.css';

export default class ProblemTable extends Component {

    render() {
        const { id, currentProblem, problem, inputAnswers, inputValue } = this.props;
        
        return (
            currentProblem === id + 1 && 
                <div id='problem'>
                    {
                        problem.map((numbersOfRow, row) => {
                            return <div key={row} className={`table-row row-${row}`}>
                                {
                                    numbersOfRow.map((num, col) => {
                                        return num === undefined ?
                                            <div key={col} className={`table-cell col-${col}`}>
                                                <input
                                                    autoComplete='off'
                                                    name={`${row}-${col}`}
                                                    value={inputAnswers[`${row}-${col}`] || ''}
                                                    onChange={inputValue}
                                                />
                                            </div>
                                            :
                                            <div key={col} className={`table-cell co1-${col}`}>
                                                <div className='numbers'>{num}</div>
                                            </div>
                                    })
                                }        
                            </div>
                        })
                    }
                </div>
        )
    }
}