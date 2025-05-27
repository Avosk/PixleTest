function get_result_from_cookie(){
    let cookies = document.cookie.split('; ')
    console.log(cookies)
    for (let i=0; i< cookies.length; i++){
        let cookie = cookies[i].split('=')
        console.log(cookie)
        if (cookie[0] == 'pixel-result'){
            return cookie[1]
        }
    }
    return '0'*700
}

let COLORS= ['rgb(73, 73, 73)', '#DEE5E5','#9DC5BB','#17B890',
            '#5E807F','#082D0F']
is_Clicked=false
let current_col = getComputedStyle(document.documentElement).getPropertyValue('--current_col')
let default_col = getComputedStyle(document.documentElement).getPropertyValue('--default_col')
let current_col_code = 1
let fill_mode = false

document.addEventListener('mousedown', function(){
    is_Clicked = true
})
document.addEventListener('mouseup', function(){
    is_Clicked = false
})

let temp_result = get_result_from_cookie()
console.log('temp-result', temp_result)

let field = document.querySelector('.field')
if(temp_result == ('0'*700)){
    for (let i =0 ;i<700;i++){
        let cell = document.createElement('div')
        cell.classList.add('cell')
        cell.setAttribute('id', `${i}` )
        cell.dataset.color = '0'
        cell.style.backgroundColor = COLORS[0]
        field.appendChild(cell)
    }
}
else{
    for (let i =0 ;i<450;i++){
        let cell = document.createElement('div')
        cell.classList.add('cell')
        cell.setAttribute('id', `${i}` )
        cell.dataset.color = temp_result[i]
        cell.style.backgroundColor = COLORS[parseInt(temp_result[i])]
        field.appendChild(cell)
}}


let cells = document.querySelectorAll('.cell')
cells.forEach(cell=>{
    cell.addEventListener('mouseover', function(){
        if(is_Clicked){
            cell.dataset.color = current_col_code
            cell.style.background = current_col
        }
    })
    cell.addEventListener('mousedown',function(){
        if (fill_mode){
            let cell_id =parseInt(cell.getAttribute('id'))
            fill_mode = !fill_mode
            for (let i =0; i<cells.length; i++){
                cells[i].dataset.color = current_col_code
                cells[i].style.background = current_col
            }
        }
        else{
            cell.dataset.color = current_col_code
            cell.style.background = current_col
        }

    })
})

let color_cells = document.querySelectorAll('.color-cell')
color_cells.forEach(color_cell => {
    color_cell.addEventListener('click',function(){
        fill_mode=false
        current_col = getComputedStyle(color_cell).background
        current_col_code =color_cell.dataset.colorcode
        document.documentElement.style.cssText = `--current_col:${current_col}`
        document.querySelector('.selected').classList.remove('selected')
        color_cell.classList.add('selected')

    })
})

document.querySelector('.eraser').addEventListener('click', function(){
    current_col = default_col
    current_col_code = '0'
    document.documentElement.style.cssText = `--current_col:${current_col};`
    this.classList.add('selected')
})

document.querySelector(".fill-tool").addEventListener('click', function(){
    fill_mode = !fill_mode
    document.querySelector('.selected').classList.remove('selected')
    this.classList.add('selected')
})

setInterval(function(){
    result = ''
    let temp_cells = document.querySelectorAll('.cell')
    for (let i = 0; i<temp_cells.length;i++){
        result +=`${temp_cells[i].dataset.color}`
    }
    document.cookie = `pixel-result=${result}; max-age=1000000`
    console.log(document.cookie)
}, 60000)

document.querySelector('.save-tool').addEventListener('click', function(){
    domtoimage.toJpeg(field, {quality:2})
    .then(function (dataUrl){
        let img = new Image()
        img.src = dataUrl
        let link = document.createElement('a');
        link.download = 'pixel.jpg'
        link.href = dataUrl
        link.click()
    })
    .catch(function (error){
        console.log('oops, something went wrong!', error)
    })
})
