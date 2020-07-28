document.addEventListener('DOMContentLoaded', () => {

    //color
        let newColor = "#"+((1<<24)*Math.random()|0).toString(16)
        setInterval(() => {
            
        for (let i = 0; i < document.querySelectorAll('.checked').length; i++){
            document.querySelectorAll('.checked')[i].style.background = newColor
        }
        document.querySelector('.colorChange').style.background= newColor
        }, 100);
    
    


    


    const grid = document.querySelector('.grid')
    let width = 10
    let squares = []
    let bombAmount = 15
    let isGameOver = false
    let gameArray = []
    let flags = 0
    let firstClick = false
    let time = 0

    document.querySelector(".flagLeft").innerHTML = bombAmount - flags
    // create Board
    function createBoard() {
        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)


        for (let i = 0; i < width * width; i++){
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            //normal click

            square.addEventListener('click', function (e) {
                click(square)
            
            })
        //cntrl and left click

            square.oncontextmenu = function (e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        //add numbers

        for (let i = 0; i < squares.length; i++){
            let total = 0
            const isLeftEdge =( i % width === 0)
            const isRightEdge = (i % width === width - 1)
            
            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bombs')) total++
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
                if (i < 90 && !isLeftEdge && squares[i -1+width].classList.contains('bomb')) total++
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++
                squares[i].setAttribute('data', total)
                
            }
            
        
        }
    }
    createBoard()
    //add flag

    function addFlag(square){
        if (isGameOver) return
        if (!square.classList.contains('checked') ) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = "🚩"
                flags++
                document.querySelector(".flagLeft").innerHTML = bombAmount - flags
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
                document.querySelector(".flagLeft").innerHTML = bombAmount - flags
            }
        }
    }

    // click on square actions

    function click(square) {
        let currentId = square.id
        if (isGameOver) return
        firstClick = true
        if( square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                square.innerHTML = total
                return
            }

            checkSqaure(square,currentId)
            
        }
        square.classList.add('checked')
    }

    // check neighboring squares once square is clicked

    function checkSqaure(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)
        
        setTimeout(() => {
            
                if (currentId > 0 && !isLeftEdge ) {
                    const newId = squares[parseInt(currentId) - 1].id
                    const newSquare = document.getElementById(newId)
                    if(gameArray[newId] === 'valid') click(newSquare)
                }
        
                if (currentId > 9 && !isRightEdge ) {
                    const newId = squares[parseInt(currentId) + 1 - width].id
                    const newSquare = document.getElementById(newId)
                    if(gameArray[newId] === 'valid') click(newSquare)
                }

                if (currentId > 10 ) {
                    const newId = squares[parseInt(currentId - width)].id
                    const newSquare = document.getElementById(newId)
                    if(gameArray[newId] === 'valid') click(newSquare)
                }
                if (currentId > 11 && !isLeftEdge ) {
                    const newId = squares[parseInt(currentId) - 1 - width].id
                    const newSquare = document.getElementById(newId)
                    if(gameArray[newId] === 'valid') click(newSquare)
                }

                if (currentId < 98 && !isRightEdge ) {
                    const newId = squares[parseInt(currentId) + 1].id
                    const newSquare = document.getElementById(newId)
                    if(gameArray[newId] === 'valid') click(newSquare)
                }
                if (currentId < 90 && !isLeftEdge ) {
                    const newId = squares[parseInt(currentId) - 1 + width].id
                    const newSquare = document.getElementById(newId)
                    if(gameArray[newId] === 'valid') click(newSquare)
                }
                if (currentId < 88 && !isRightEdge ) {
                    const newId = squares[parseInt(currentId) + 1 + width].id
                    const newSquare = document.getElementById(newId)
                    if(gameArray[newId] === 'valid') click(newSquare)
                }

                if (currentId < 89 ) {
                    const newId = squares[parseInt(currentId) + width].id
                    const newSquare = document.getElementById(newId)
                    if(gameArray[newId] === 'valid') click(newSquare)
                }
        },50)
    }

    //game over

    function gameOver(square) {
        console.log('Boom', 'gameover')
        isGameOver = true
        firstClick = false
        time=0
        //show ALL the bombs

        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = "🔥";
            }
        })
    }

    // check for win

    function checkForWin() {
        let matches=0
        for (let i = 0; i < squares.length; i++){
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches ++
            }
            if (matches === bombAmount) {
                console.log('you win!')
                isGameOver = true
                firstClick = false
                time=0
            }
        }
    }

    function deleteClasses() {
            for (let i = 0; i < width * width; i++) {
            document.querySelector('.grid').removeChild(squares[i])
        }
        squares = []
        gameArray=[]
    }
    //smile button
    document.querySelector('.smile').addEventListener('click', () => {
        time=0
        document.querySelector('.smile').style.transform = "scale(0.7)"
        setTimeout(() => {
            document.querySelector('.smile').style.transform = "scale(1.0)"
        }, 100);

        isGameOver = false;
        firstClick = false;
        flags = 0
        document.querySelector('.time').innerText = `00:00`
        document.querySelector(".flagLeft").innerHTML = bombAmount - flags
        console.log('clicked')
        deleteClasses()
        createBoard()
    })
    
    //color
    document.querySelector('.colorChange').addEventListener('click', () => {
        

        newColor = "#"+((1<<24)*Math.random()|0).toString(16)
            
        for (let i = 0; i < document.querySelectorAll('.checked').length; i++){
            document.querySelectorAll('.checked')[i].style.background = newColor
        }
        document.querySelector('.colorChange').style.background= newColor



    })


    //time

    setInterval(() => {
        
    if (firstClick === true) {
        if (time < 3600) {
            if (time%60 < 10) {
                document.querySelector('.time').innerText = `0${Math.floor(time/60)}:0${time%60}`
            } else {
                document.querySelector('.time').innerText = `0${Math.floor(time/60)}:${time%60}`
            }
        }
         else {
            if (time%60 < 10) {
                document.querySelector('.time').innerText = `${Math.floor(time/60)}:0${time%60}`
            } else {
                document.querySelector('.time').innerText = `${Math.floor(time/60)}:${time%60}`
            }
        }
            time++
    }
    }, 1000);

    document.querySelector('.box').addEventListener('contextmenu', (e) => {
        e.preventDefault()
    })

    
})

