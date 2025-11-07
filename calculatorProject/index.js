for(var i=0;i<document.querySelectorAll(".icon").length;i++){
    document.querySelectorAll(".icon")[i].addEventListener("click",handleClick);
    function handleClick(){
        var text=this.innerHTML;
        calculate(text);
    }
}

function calculate(value){
    const screen=document.querySelector(".screen");
        switch (value) {
            case "AC":
                screen.innerHTML="";
                break;
            case "DEL":
                screen.innerHTML = screen.innerHTML.slice(0, -1);
                break;
            case "=":
                try {
                    screen.innerHTML = eval(screen.innerHTML);
                } catch {
                    screen.innerHTML = "Error";
                }
                break;

            case "( )":
                const openCount = (screen.innerHTML.match(/\(/g) || []).length;
                const closeCount = (screen.innerHTML.match(/\)/g) || []).length;
                if (openCount > closeCount) {
                    screen.innerHTML += ")";
                } else {
                    screen.innerHTML += "(";
                }
                break;
            default:
                screen.innerHTML+=value;
                break;
        }
}