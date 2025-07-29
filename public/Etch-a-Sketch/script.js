let container = document.querySelector('.container');
let btn = document.querySelector('#reset');

let height, width;

btn.addEventListener('click', () => {
    btn.style.backgroundColor = "#3D74B6";
    setTimeout(()=> btn.style.backgroundColor = "#DC3C22" , 200);
    width = parseInt(prompt("Enter the number of grids horizontally: "));
    height = parseInt(prompt("Enter the number of grids vertically: "));
    container.innerHTML = '';
    createElements(width, height);
});

function createElements(width, height) {
    for (let i = 0; i < width * height; i++) {
        let d = document.createElement('div');
        d.classList.add('grid');
        d.style.width = `${100 / width}%`;
        d.style.height = `${100 / height}%`;

        d.addEventListener('mouseenter', () => {
            d.style.backgroundColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
            d.style.opacity = 0.9;
        });
        d.addEventListener('mouseleave', () => {
            setTimeout(() => {
                d.style.backgroundColor = `rgb(${255},${255},${255})`;
                d.style.opacity = 1;
            }, 5000);
        });
        container.appendChild(d);
    }
}
let p = document.createElement('p');
p.textContent = 'Fill all the grids in 5 seconds';
container.appendChild(p);