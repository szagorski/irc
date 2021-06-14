//scrollbar
let scrollbar;

//elementy html
let guzik = document.querySelector("button");
let input = document.querySelector("input");
let wiadomosci = document.querySelector("#wiadomosci");

//zmienne
let nick = prompt("Podaj swój nick: ");
let kolor = Math.round(0xffffff * Math.random()).toString(16); //losowy kolor na starcie

console.log("Wpisz /komendy aby poznać wszystkie opcje...");

//funkcja odbierająca dane z serwera
async function odbierz() {
  let odpowiedz = await fetch("/odbierz");
  if (odpowiedz.status === 200) {
    let dane = await odpowiedz.json();
    console.log(dane);

    for (let wiadomosc of dane) {
      //wiersz wiadomości
      let div = document.createElement("div");

      //czas
      let span = document.createElement("span");
      span.textContent = `[${wiadomosc.czas}] `;
      div.appendChild(span);

      //nick
      span = document.createElement("span");
      span.textContent = `< @${wiadomosc.uzytkownik} > `;
      span.style.color = `#${wiadomosc.kolor}`;
      div.appendChild(span);

      //wiadomość
      span = document.createElement("span");
      span.textContent = wiadomosc.wiadomosc;
      $(span).emoticonize();
      div.appendChild(span);

      //automatyczne scrollowanie
      scrollbar.getContentElement().appendChild(div);
      let scroll = scrollbar.getScrollElement();
      scroll.scrollTop = scroll.scrollHeight;
    }
  }
  //long polling
  odbierz();
}
//wysyłanie wiadomości
function wyslij() {
  let wiadomosc = input.value; //wiadomość

  //jeśli wiadomość nie jest pusta i nie jest komendą
  if (wiadomosc.trim() !== "" && wiadomosc[0] !== "/") {
    let dane = {
      uzytkownik: nick, //nick użytkownika
      czas: new Date().toLocaleTimeString(), //czas wysłania
      kolor: kolor, //kolor użytkownika
      wiadomosc: wiadomosc, //wiadomosc
    };
    //wysłanie wiadomości na serwer
    fetch("/wyslij", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dane),
    });

    //jeśli to komenda
  } else if (wiadomosc[0] === "/") {
    let komenda = wiadomosc.split(" ");
    switch (komenda[0]) {
      case "/kolor":
        kolor = komenda[1]; //zmienia color
        break;
      case "/nick":
        nick = komenda[1]; //zmienia nick
        break;
      case "/komendy": //wypisanie dostępnych komend
        let div = document.createElement("div");
        div.textContent =
          "Dostepne komendy: /nick [nazwa] -  zmiana nicku, /kolor [kolor hex] - zmiana koloru, /komendy - to właśnie wpisałeś";

        //automatyczne scrollowanie
        scrollbar.getContentElement().appendChild(div);
        let scroll = scrollbar.getScrollElement();
        scroll.scrollTop = scroll.scrollHeight;
        break;
    }
  }
  input.value = ""; //czyszczenie okienka
}

//funkcja inicjująca aplikację - dodaje scrollbar i rozpoczyna odbiór danych
function init() {
  scrollbar = new SimpleBar(document.getElementById("wiadomosci"));
  odbierz();
}

window.onload = init; //inicjowanie aplikacji po załadowaniu okna

//zdarzenia wysłania wiadomości:
guzik.addEventListener("click", wyslij); //po kliknięciu guzika
input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) wyslij(); //po kliknięciu ENTER
});
