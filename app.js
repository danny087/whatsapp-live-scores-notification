const app = require('express')()
const request = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')
const axios = require('axios')
const fetch = require('node-fetch')
require("dotenv").config()


            app.listen(process.env.PORT || 9090,() => {
             
                console.log('listening on 9090')
                
            })



        const football365 = async (teamName,$) => {
            
            try{
    
            let listOfMatchHfref = []

            const getLiveHfrefs = $('.match_table_content').children('a').each((index,element) => {
            
                listOfMatchHfref.push($(element).attr())
                
        })
   
            let selectedTeamLiveHfref = []

            let team = teamName.replace(/ /g,'-')


            listOfMatchHfref.filter(item => {
 
            if(item.href.includes(team.toLowerCase()) === true){
                
                selectedTeamLiveHfref.push(item.href)
                    
            } 
                })


            if(selectedTeamLiveHfref.length !== 0) {
    
 
            const games = await request.get(`https://livescore.football365.com/football/live${selectedTeamLiveHfref[0]}`)
            $ = await cheerio.load(games);
            
            let arrayGoalscores = ''
            
            let homeScore = $('.home-score').text()
            let awayScore = $('.away-score').text()
            let homeTeam = $('.txt-home-team').text() 
            let awayTeam = $('.txt-away-team').text()
            let goalScorer = $('.goal_detail_block').text().replace(/\s\s+/g, ' ')

            arrayGoalscores += goalScorer
    
    
            let splitOnspace = arrayGoalscores.replace(/' /g,'')
            let splitBeforeNumber = splitOnspace.split(/\s+(?=\d)/g)
            let filtered = splitBeforeNumber.filter(function (el) {
            
                return el !== '';
                    
            });
  
            let newscorline = filtered
            .map(item => item.replace(/[^0-9\s]/g,''))


            let goals = filtered
            .map(item => item.replace(/\d+/g,''))
            .map((item,i) => `${newscorline[i]}${item}`)


            let scoreArray = [homeScore,awayScore]
            let dataObject = {scoreArray,homeTeam,awayTeam,goals}

            waitForGoals(dataObject)

   }

        return null


      } catch(error){
        
        console.log(error,'error on football365 function')
  }
    };
  



   

    
        let compareArrays = []
  

        const waitForGoals = async (scoreline) => { 
    
            try{
       
                compareArrays.push(scoreline.goals)
        
       
                if(compareArrays[1]){
            
           
                    if(compareArrays[0].length === compareArrays[1].length){
                
                        compareArrays.pop()
                
                    }  else{
                
                     whatsappMessage(scoreline)
                
                        compareArrays.shift()
                    }
       
                                        }
            

                    return null


                        } catch(err){
                    
                            console.log(err,'$$$$$$$$$')
                            
                        }

                                        }


                    const whatsappMessage = async (scoreline) => {

                    let client = require('twilio')(
                    process.env.TWILIO_API_KEY,
                    process.env.TWILIO_TOKEN
        
                    )


                let messageBody = `
                GOOOOOAL!!!!!
         
                ${scoreline.goals[scoreline.goals.length - 1]}!!

                ${scoreline.homeTeam} - ${scoreline.scoreArray[0]}

                ${scoreline.awayTeam} - ${scoreline.scoreArray[1]}`


                client.messages.create({
                    from: process.env.TWILIO_NUM,
                    to:process.env.MY_NUM,
                    body:messageBody
                },(err,message) => {
            if(err){
        console.log(err.message,'hhhh')
            }
                })
         }







            setInterval(async () => {
                
                try{
      
            const infinteScroll = async () => {
       
                const getAllLiveData = await fetch("https://livescore.football365.com/Football/LoadFootballMatches", 
                {"credentials":"include","headers":
                {"accept":"text/html, */*; q=0.01","accept-language":"en-GB,en-US;q=0.9,en;q=0.8","content-type":"application/x-www-form-urlencoded; charset=UTF-8","x-requested-with":"XMLHttpRequest"},
                "referrer":"https://livescore.football365.com/football/live","referrerPolicy":"no-referrer-when-downgrade","body":"Type=Live&pageIndex=0&pageSize=80","method":"POST","mode":"cors"});

                return await getAllLiveData.text()
            
            }

            let $ = await cheerio.load(await infinteScroll())
    
            football365('everton',$)

                } catch(err){
            console.log(err,'SSSSSSS')
                }
                    },200000)



