

const formAuthenticity= document.querySelector('.authenticityCode');

const getItemByCode = (idItem) =>{
   try {
        return  axios.get(`http://127.0.0.1:8000/api/v1/items/${idItem}`)
    }catch (error){
         console.error(error);
   }
};


formAuthenticity.addEventListener('submit', async (e)=>{
    e.preventDefault();
    console.log('ciao')
    const IdItem = document.getElementById('authenticityCode__input');
    console.log(IdItem.value);
    const item = await getItemByCode(IdItem.value);
    console.log(item);
});