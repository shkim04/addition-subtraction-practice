import React, { Component } from 'react';
import ProblemTable from './problemTable';
import './problemSection.css';

const basicBlankRule = {
    4: 6,
    5: 8,
    7: 10
}

const tableInfo = [
    {
        size: 4,
        range: 100
    },
    {
        size: 5,
        range: 20
    },
    {
        size: 4,
        range: 100
    },
    {
        size: 5,
        range: 50
    },
];

export default class ProblemSection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            exercises: tableInfo.map(el => { 
                            let ex = this.getProblem(el.size, el.range)
                            return { problem: ex.problem,
                                    answer: ex.answer }
                        }),
            inputAnswers: {},
            isStarted: false,
            isEvaluated: false,
            startVisible: true,
            xCount: 0,
            currentProblem: 1,
            startTime: 0,
            totalTimeSpent: 0,
            gradeColor: null
        }
    }

    getRow(length, range) {
        let rowArr = [];
        let rowTotal = 0; 
        
        for(let i = 0; i < length; i++) {
            let randomNum = Math.ceil(Math.random() * range) * (Math.round(Math.random()) ? 1 : -1)
            if(i === length - 1) {
                rowArr.push(rowTotal); break;
            }
            rowArr.push(randomNum);
            rowTotal += randomNum;
        }
        return rowArr;//get the row of random numbers including the sum of the row in the last column
    }

    getNumbersWithNoBlanks(length, range) {
        let rowAndCol = [];
        let colTotal = new Array(length).fill(0);

        for(let i = 0; i < length; i++) { 
            if(i === length - 1) {
                rowAndCol.push(colTotal); break;
            }
            rowAndCol.push(this.getRow(length, range));

            for(let j = 0; j < length; j++) {
                colTotal[j] += rowAndCol[i][j];//the last row is the sum of each col
            }
        }
        return rowAndCol; //get the rows and cols with numbers, no blanks yet
    }
        
    getProblem(length, range) {
        let original = this.getNumbersWithNoBlanks(length, range);
        let exercise = { problem : [], answer : {} };
        let rowBlank = [], colBlank = [], blankCount = 0, outOfRules;
        
        do {
            outOfRules = false
            exercise.problem = original.map(row => {
                return row.map((num, col) => {
                    return col === Math.floor(Math.random() * length) ? undefined : num;
                })
            });
               
            for(let i = 0; i < length; i++) {
                for(let j = 0; j < length; j++) {
                    if(exercise.problem[i][j] === undefined) {
                        blankCount++;
                        rowBlank.push(i);
                        colBlank.push(j);
                        exercise.answer[`${i}-${j}`] = original[i][j];  
                    }
                }
            }
            if(blankCount !== basicBlankRule[length] ||
                (this.blankDuplicateCheck(rowBlank) && this.blankDuplicateCheck(colBlank))) {
                    exercise = { problem: [], answer: {} };
                    blankCount = 0; rowBlank = []; colBlank = []; outOfRules = true;
            } else break; // Only if there are more than 2 rows that have more than 2 blanks and more than 2 cols that have more than 2 blanks simultaneously
        } while(outOfRules);
        return exercise;
    }//get the problem table by a few rules to make sense to solve
    
    blankDuplicateCheck(targetArr) {
        let count = {}, duplicates = 0;
        
        targetArr.forEach(el => {
            count[el] = (count[el] || 0) + 1;
        })

        for( let keys in count ) {
            if(count.hasOwnProperty(keys)) {
                count[keys] > 1 ? duplicates++ : duplicates += 0;
            }
        }
        return duplicates > 1 ? true : false;
    }//check to see how many elements in the array are duplicated

    inputValue = (e) => {
        let inputAnswers = {...this.state.inputAnswers};
        inputAnswers[e.target.name] = e.target.value;

        this.setState({
            inputAnswers
        })
    }

    startProblems = () => {
        let result = document.getElementById('result');
        if((this.state.isEvaluated && result.innerHTML != null)) { result.innerHTML = '' } 
        this.setState({
            startTime: Math.floor(Date.now() / 1000),
            isStarted: true,
            startVisible: false
        })

        this.countUp = setInterval(() => {
            this.setState({
                totalTimeSpent: Math.floor(Date.now() / 1000) - this.state.startTime,
            })
        }, 1)
    }

    nextOrFinish = (current) => {
        const { currentProblem, inputAnswers, exercises } = this.state;
        if(Object.values(inputAnswers).length !== Object.values(exercises[current].answer).length) {
            alert('Fill all the blanks');
        }
        else {
            let count = 0;

            for(let keys in inputAnswers) {
                inputAnswers[keys] === exercises[current].answer[keys] ? count += 0 : count++;
            }
            
            if(current === exercises.length - 1) {
                clearInterval(this.countUp);

                this.setState(prevState => ({
                    xCount: prevState.xCount + count,
                    isStarted: false,
                    isEvaluated: true,
                    startVisible: true
                }), () => {
                    this.gradeAnswers()
                    this.setState({
                        exercises: tableInfo.map(el => { 
                                        let ex = this.getProblem(el.size, el.range)
                                        return { problem: ex.problem,
                                                answer: ex.answer }
                                    }),
                        inputAnswers: {},
                        xCount: 0,
                        currentProblem: 1,
                    })
                })
            }
            else {
                this.setState(prevState => ({
                    xCount: prevState.xCount + count,
                    inputAnswers: {},
                    currentProblem: currentProblem >= 4 ? 5 : currentProblem + 1,
                }))
            }
        }
    }

    gradeAnswers = () => {
        const { totalTimeSpent, xCount} = this.state;
        let timeEvaluated = totalTimeSpent + xCount * 10;
        let grade = document.getElementById('result');
        if(xCount >= 14) {
            grade.innerHTML = 'Failed'; this.setState({ gradeColor: 'red'});
        }
        else if(timeEvaluated <= 240) {
            grade.innerHTML = 'Superior'; this.setState({ gradeColor: 'blue'});
        }
        else if(timeEvaluated > 240 && timeEvaluated <= 300) {
            grade.innerHTML = 'Excellent'; this.setState({ gradeColor: 'green'})
        }
        else if(timeEvaluated > 300 && timeEvaluated <= 360) {
            grade.innerHTML = 'Good'; this.setState({ gradeColor: 'navy'});
        }
        else if(timeEvaluated > 360 && timeEvaluated <= 420) {
            grade.innerHTML = 'Average'; this.setState({ gradeColor: 'brown'});
        }
        else if(timeEvaluated > 420 && timeEvaluated <= 480) {
            grade.innerHTML = 'Acceptable'; this.setState({ gradeColor: 'yellow'});
        }
        else {
            grade.innerHTML = 'Need work'; this.setState({ gradeColor: 'orange'});
        }
    }

    nextButton = () => {
        const { currentProblem, exercises } = this.state;
        return currentProblem < exercises.length ?
                <div className='next-btn-container clearfix'>
                    <button
                        id='btn-next' 
                        className='next-or-finish' 
                        type='button'
                        onClick={() => this.nextOrFinish(currentProblem - 1)}
                    >
                        Next
                    </button>
                </div>            
                :
                <div className='next-btn-container clearfix'>
                    <button
                        id='btn-finish'
                        className='next-or-finish' 
                        type='button'
                        onClick={() => this.nextOrFinish(currentProblem - 1)}
                    >
                        Finish
                    </button>
                </div>
    }

    render() {
        const { exercises, startVisible, isEvaluated, isStarted, totalTimeSpent, gradeColor } = this.state;
        let problems = [];
        for(let i = 0; i < exercises.length; i++) {
            problems.push(
                <ProblemTable
                    key={i}
                    id={i} 
                    currentProblem={this.state.currentProblem}
                    problem={this.state.exercises[i].problem}
                    inputAnswers={this.state.inputAnswers}
                    inputValue={this.inputValue}
                />
            )
        }

        let min = Math.floor(totalTimeSpent / 60), sec = Math.floor(totalTimeSpent % 60);
        if(min < 10) min = '0' + min;
        if(sec < 10) sec = '0' + sec;
        
        return (
            <div id='whole-app-container'>
                {   
                    startVisible && 
                        <div id='start'>
                            <div className='start-btn-container clear-fix'>
                                <button 
                                    id='btn-start' 
                                    type='button'
                                    onClick={this.startProblems}
                                >
                                    {!isEvaluated ? 'Start' : 'Restart'}
                                </button>
                            </div>
                        </div>
                }
                {
                    isStarted && 
                        <div className='problem-container'>
                            {problems}    
                            {this.nextButton()}
                        </div> 
                }
                <div className='result-container'>
                    <div id='result' style={{"backgroundColor": gradeColor}}/>
                </div>
                <div className='count-container'>
                    <div id='count-up'>{min}:{sec}</div>    
                </div>                
            </div>
        )
    }
}
