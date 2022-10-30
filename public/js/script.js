'use strict'



const html = document.querySelector("html");
const body = document.querySelector("body");

const header = document.querySelector(".header");

const secondhandbar = document.querySelector(".secondhandbar");
const authenticity = document.querySelector(".authenticity");
const featuredCategories = document.querySelector(".featured-categories");
const newsletter = document.querySelector(".newsletter");
const featured = document.querySelector(".featured");
const circularimg = document.querySelector(".circular__img");
const circulardesc = document.querySelector(".circular__desc");
const features = document.querySelector(".features");

const followus = document.querySelector(".follow-us");
const footer = document.querySelector(".footer")

const navButt = document.querySelector(".navigation__button");
const navList= document.querySelector(".navigation__nav");
const navListArr = document.querySelectorAll(".navigation__list__small");

const cardShop = document.querySelector(".card");
const item = document.querySelector('.item');

const imgChange = document.querySelectorAll('.item__imgDetail');
const imageCover = document.querySelector('.item__imgCover');



//delete effect of nav at the beginning (smartphone)
window.onload = function(){
    const mediaQuery = window.matchMedia('(max-width: 40em)')

    if (mediaQuery.matches) {
        setTimeout( ()=>{
            navList.style.visibility= "visible";
            navList.style.display= "block";
        }, 1000);
    }; 
};




for (let i = 0; i < imgChange.length; i++) {
     imgChange[i].addEventListener("click", function(e) {
            e.preventDefault();
            imageCover.src= e.currentTarget.src;
     });
}
 



// handle menu nav smart
navButt.addEventListener("click", function(e) {
    console.log('click');
    e.preventDefault();
    if(navList.classList.contains("navHome") || navList.classList.contains("navItem")){
        navList.classList.toggle("navigation__nav__active");
        console.log('click 2');
        //allow not scroll navigation smart if button is open 
        if(navList.classList.contains("navigation__nav__active")){
            authenticity.style.display= "none";
            featuredCategories.style.display = "none";
            newsletter.style.display="none";
            featured.style.display ="none";  
            circularimg.style.display= "none";
            circulardesc.style.display = "none";
            features.style.display = "none";
            followus.style.display = "none";
            footer.style.display= "none";

        }else{
          
            navList.style.visibility= "visible";
            navList.style.display= "block";
            authenticity.style.display = "block";
            featuredCategories.style.display = "flex";
            newsletter.style.display="block";
            featured.style.display ="flex";
            circularimg.style.display= "grid";
            circulardesc.style.display = "grid";
            features.style.display = "grid";
            followus.style.display = "grid";
            footer.style.display= "grid"
        }

    }else if(navList.classList.contains("navShop")){
        navList.classList.toggle("navigation__nav__active");

//I WANT DISABLE BUTTON FOR 250MS TO AVOID BUG ON DOUBLE CLICK FAST
        //allow not scroll navigation smart if button is open 
        if(navList.classList.contains("navigation__nav__active")){
            
    
            setTimeout(()=>{
                cardShop.style.display="none";
                footer.style.display= "none";
            }, 200);
           

        }else{
            
        
            cardShop.style.display="flex";
            footer.style.display= "grid";
        }

        

        
    }else if(navList.classList.contains("navHome")){
        navList.classList.toggle("navigation__nav__active");
        
        if(navList.classList.contains("navigation__nav__active")){
            
            console.log('if');
            setTimeout(()=>{
                item.style.display="none";
                footer.style.display= "none";
            }, 200);
           

        }else{
          
            item.style.display="???";
            footer.style.display= "grid";
        }

        
    }

});






 


