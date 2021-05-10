const avatarButton = document.getElementById('delAvatar')
const deleteAccountButton = document.getElementById('deleteAccount')

let avatar = document.getElementById('avatar')
const profileParent = document.getElementById("message");
const profileMessageDiv = document.createElement("div");

if(avatarButton){
    avatarButton.addEventListener('click',()=>{
    const ajax = new XMLHttpRequest()

    ajax.open('delete','profile/deleteAvatar',true)

    ajax.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            if(JSON.parse(this.responseText).status === 'success'){
                profileMessageDiv.classList = `alert shadow alert-success alert-dismissible`;
                profileMessageDiv.innerHTML = 'آواتار با موفقیت حذف شد'
                avatar.setAttribute('src',JSON.parse(this.responseText).avatar)
                avatarButton.remove()
                profileParent.appendChild(profileMessageDiv);
                window.scrollTo(0,0)

            }
            else if(JSON.parse(this.responseText).status === 'error'){
                profileMessageDiv.classList = `alert shadow alert-danger alert-dismissible`;
                profileMessageDiv.innerHTML = 'هنگام حذف حساب آواتار مشکلی پیش آمده لطفا مجددا تلاش فرمایید'
                profileParent.appendChild(profileMessageDiv);
                window.scrollTo(0,0)
            }
        }
            
    }

    ajax.send()
})
}



deleteAccountButton.addEventListener('click',()=>{
    const ajax = new XMLHttpRequest()

    ajax.open('delete','profile/deleteAccount',true)

    ajax.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            if(JSON.parse(this.responseText).status === 'success')
                window.location.replace(JSON.parse(this.responseText).url)
                
            else if(JSON.parse(this.responseText).status === 'error'){
                profileMessageDiv.classList = `alert shadow alert-danger alert-dismissible`;
                profileMessageDiv.innerHTML = 'هنگام حذف حساب کاربری مشکلی رخ داده است لطفا مجددا تلاش فرمایید'
                profileParent.appendChild(profileMessageDiv);
                window.scrollTo(0,0)
            }
        }
            
    }

    ajax.send()
})