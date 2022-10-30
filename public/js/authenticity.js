const formAuthenticity= document.querySelector('.AuthenticityCode');

const getItemByCode = (idItem) =>{
    axios({
        method: 'GET',
        url: 'http://127.0.0.1:8000/api/v1/items',
        data: {
            idItem
        }
    });
};


formAuthenticity.addEventListener('submit', e=>{
    e.preventDefault();
    console.log()
    const IdItem = document.getElementById('authenticityCode__input')
    const item = getItemByCode(IdItem);
    console.log(item);
});