export const offCanvasToggle=(e)=>{
    let body=document.querySelector('body');
    if(e=='js-hamburger'){
        let button = document.getElementById(e)
        button.classList.toggle('is-active');
        
         }
    body.classList.toggle('offcanvas--isOpen');
    e.classList.toggle('is-active');
    // if(button.classList.contains('is-active')) button.classList.remove('is-active')


}

let dsMenus=document.querySelectorAll('.js-activeClass');
console.log(typeof(dsMenus));
dsMenus.forEach(item=>{
    
   
    item.addEventListener('click', (e)=>{
        dsMenus.forEach(links=>{
            links.classList.remove('active')
        })
        e.target.classList.add('active');
        
    })
})
 