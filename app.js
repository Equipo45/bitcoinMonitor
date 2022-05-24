//1. Import coingecko-api
const CoinGecko = require('coingecko-api');
const Discord = require("discord.js")
const prompt = require("prompt-sync")({ sigint: true });

//Hook
const hookText=prompt("Mete el WebHook de tu canal de Discord: ")
const webhook = new Discord.WebhookClient({url:hookText});


//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();


//CRIPTOMONEDA PARA MONITORIZAR BITCOIN COMO BASE
let criptomoneda = prompt("Introduce la criptomoneda a monitorizar:")

//Intervalo de minutos entres peticiones del hook
//Minutos para hacer peticiones , si da error 1015 , tienes que utilizar una api de pago 
//ya que estas superando el limite de peticiones por minuto
const minutes = 5;
let interval = minutes * 60 * 1000;

//3. Make calls
let monitor = async() => {
    
    let JSONdata = await CoinGeckoClient.coins.fetchTickers(criptomoneda)
    let data = JSONdata.data.tickers[0];
    //Las anomalias se detectan con este metodo https://eurekastatistics.com/using-the-median-absolute-deviation-to-find-outliers/
    //Uso de la desviacion media
    if(data.is_anomaly){

        webhook.send(criptomoneda.toUpperCase()+"\n---------------------------------------------------\nPrice Detected!"+"\nPrice: "+ data.last+"\nVolumen: "+ data.converted_volume.usd+"\nTimestamp UTC: "+ data.timestamp).catch(console.error);
        console.log("---------------------------------------------------\nLast one Send at <"+data.timestamp+">")
    }
    
   
};


setInterval(function(){
    monitor();
},interval)
