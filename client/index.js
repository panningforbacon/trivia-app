import io from 'socket.io-client';

// Vanilla'fied JQuery Functions
//.ready()
const ready = (callback) => {
    if (document.readyState != 'loading') callback();
    else document.addEventListener('DOMContentLoaded', callback);
}

// Meat'n'Taters
ready(() => {

    const socket = io({ transports: ['websocket'] });

    socket.on('reconnect_attempt', () => {
        socket.io.opts.transports = ['polling', 'websocket'];
    })

    socket.on('server-to-client', (msg) => {
        console.log(`server-to-client: "${msg}`);
    })


    let activeForm
    window.addEventListener('keydown', (e) => {
        if (e.keyCode == 13) {
            if (!activeForm) return;
            activeForm.submit()
        }
    });

    setLoginState()



    const setLoginState = () => {
        document.querySelectorAll('.page').style.display = 'none'
        document.querySelector('#mainPage').style.display = 'block'

        activeForm = document.querySelector('#loginPage>form');
        activeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            socket.emit('client-to-server', activeForm.querySelector('input').value())
            activeForm.querySelector('input').value() = '';
        })

        
    }


    // Clicks on 'Send' button
    document.getElementById("send").addEventListener('click', (e) => {
        const input = document.getElementById("input")
        const str = input.value
        input.value = ''
        socket.emit('client-to-server', str)
        return false
    });
});

let activePage
let activeForm
let activeInput


const setState = (state) => {
    if (state == 'login') isLogin = true
    document.querySelector("div.page").style.display = "none"
    activePage = document.querySelector(isLogin ? "#loginPage" : "#mainPage")
    activePage.style.display = "block"
    activeForm = activePage.querySelector("form")
    activeInput = activePage.querySelector("input.default-input")

}




