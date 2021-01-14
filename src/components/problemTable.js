import React, { Component } from 'react';
import './problemTable.css';

export default class ProblemTable extends Component {

    render() {
        const { id, axisInfo, currentProblem, problem, inputAnswers, inputValue } = this.props;
        
        return (
            currentProblem === id + 1 && 
                <div id='problem' style={{"gridTemplateColumns": `1fr ${axisInfo.length}fr`}}>
                    <div className="separate-x-and-y"></div>
                    <div className="table-container x-info">
                        <div className="table-row">
                            {
                                axisInfo[id].x.map((info, index) => {
                                    return <div key={index} className="table-cell">{info}</div>
                                })
                            }
                        </div>
                    </div>
                    <div className="table-container y-info">
                        {
                            axisInfo[id].y.map((info, index) => {
                                return <div key={index} className="table-row">
                                            <div className="table-cell">{info}</div>
                                        </div>
                            })
                        }
                    </div>
                    <div className=" table-container problem-number-part">
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
                </div>
        )
    }
}