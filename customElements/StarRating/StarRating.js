/*
*  // html
*  <star-rating id="id" rating="3" user-rating="4" star-size="50px" background="#ffffff">
*      <p slot="before">before</p>
*      <p>after</p>
*  </star-rating>
*
*/



// path:
const StarRatingLinkFile = document.currentScript.src.split('/').slice(0,-1).join('/');
//or in module
// const StarRatingLinkFile = import.meta.url.split('/').slice(0,-1).join('/');



class StarRating extends HTMLElement {
  static observedAttributes = ["background", "star-size","rating", "user-rating"];

  constructor(){
    super();
    this.rating = 0;
    this.isFirstLoad = true;

    const shadow = this.attachShadow({ mode: "open" })
    const html = `
    <link rel="stylesheet" href="${StarRatingLinkFile}/StarRating.css">
    <slot name="before"></slot>
    <div class="stars">
        <div class="star-box"><div class="star-hover"></div><div class="star-hover"></div><div class="star"> <div></div><div></div> </div></div>
        <div class="star-box"><div class="star-hover"></div><div class="star-hover"></div><div class="star"> <div></div><div></div> </div></div>
        <div class="star-box"><div class="star-hover"></div><div class="star-hover"></div><div class="star"> <div></div><div></div> </div></div>
        <div class="star-box"><div class="star-hover"></div><div class="star-hover"></div><div class="star"> <div></div><div></div> </div></div>
        <div class="star-box"><div class="star-hover"></div><div class="star-hover"></div><div class="star"> <div></div><div></div> </div></div>
    </div>
    <slot></slot>
    <style id="size"></style>
    <style id="background"></style>
    `;

    shadow.innerHTML = html;
  } 




  connectedCallback() {
    this.isFirstLoad = false;
    const starsClicks = this.shadowRoot.querySelectorAll(".star-hover");

    starsClicks.forEach((element,userRating)=>{
      // click on star
      element.addEventListener('click',()=>{
        this.setAttribute('user-rating', (userRating+1)/2); 
      });

    }); 
  }


  attributeChangedCallback(name, oldValue, newValue) {

    // console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`);
    
    switch (name) {
      case 'star-size':

        if(newValue && !newValue.split(" ")[1]){

          if(newValue.includes('%')){
            this.shadowRoot.getElementById('size').innerHTML = `
              .stars{
                width: ${newValue};
                height:  ${newValue};;
              } 
            `
          } else{
            this.shadowRoot.getElementById('size').innerHTML = `
              .stars{
                width: calc( ${newValue} * 5);
                height:  ${newValue};
              } 
            `
          }
          
        } 

        else if(newValue && newValue.split(" ")[1]){
          this.shadowRoot.getElementById('size').innerHTML = `
          .stars{
            width: ${newValue.split(" ")[0]};
            height: ${newValue.split(" ")[1]};;
          } 
        `
        } 
        
        else {
          this.shadowRoot.getElementById('size').innerHTML = '';
        } 

        break;


      case 'background':

        if(newValue){
          this.shadowRoot.getElementById('background').innerHTML = `
            .star-box{
              --background: ${newValue}; 
            } 
          `
        } else {
          this.shadowRoot.getElementById('background').innerHTML = '';
        }
        break;
        

      case 'rating': {

        const halfStar = this.shadowRoot.querySelectorAll(".star div");
  
        if(newValue){
          this.rating = newValue * 2;

          // set stars color
          halfStar.forEach((e,i) => {
          
            if(i<this.rating){
              e.style.background = 'yellow';
              e.style.boxShadow = "-5px 0px 0 0 yellow";
  
            } else {
              e.style.background = 'var(--background)';
              e.style.boxShadow = "-5px 0px 0 0 var(--background)";
            }   

          });
  
          } 
          
          else {
            halfStar.forEach( e => {  
              e.style.background = 'var(--background)';
              e.style.boxShadow = "-5px 0px 0 0 var(--background)";
              
            });
            this.rating = 0;
          }

          //no break;
          newValue = this.getAttribute('user-rating');
      }


      case 'user-rating':{
        // throw error
        if (!(!isNaN(newValue) && (0 <= newValue) && (newValue<= 5))){
          const e = new Error();
          e.name ='customElement'
          e.message = `<star-rating user-rating='${newValue}'> \n "user-rating" should be a number between 0 and 5`;
          throw e;
        }


        if(!this.isFirstLoad){
          // send reting
          console.log("user-rating:",[this.id, Number(newValue)]);
          // ...   

        }


        const userRating = (newValue * 2) - 1;
        const halfStar = this.shadowRoot.querySelectorAll(".star div");

        

        // set colors in click
        halfStar.forEach((e,i)=>{

          // set user-rating color
          if(userRating>=i){
            e.style.background = '#a9a914';
            e.style.boxShadow = "-5px 0px 0 0 #a9a914";
          } else {
            e.style.background= "var(--background)";
            e.style.boxShadow = "-5px 0px 0 0 var(--background)";
          }

          // set rating color
          if(this.rating > i){
            if((i > userRating) || (userRating >= this.rating)){
              e.style.background = 'yellow';
              e.style.boxShadow = "-5px 0px 0 0 yellow";
            } 
          }  
        });

        break;
      }

      default:
        throw new Error()
    }
    

  }


}

customElements.define('star-rating', StarRating);



