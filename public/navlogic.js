// Navbar logic
let navbarflag = 0;
document.getElementById("ham").addEventListener("click", () => {
    let navbarn = 0;
    let opts = document.getElementsByClassName("options");
    let optar = [];
    let func = () => { };
    if (navbarflag == 0) {
        optar = Array.from(opts);
        navbarflag = 1;
        for (let i of optar) {
            setTimeout(() => {
                i.classList.remove("hidden");
            }, 50 * navbarn);
            navbarn++;
        }
    } else {
        optar = Array.from(opts);
        optar.reverse();
        navbarflag = 0;
        for (let i of optar) {
            setTimeout(() => {
                i.classList.add("hidden");
            }, 50 * navbarn);
            navbarn++;
        }
        
    }
});
// navbar logic
//careful opts optar