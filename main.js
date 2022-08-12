
document.querySelector('button').addEventListener('click', getFetch)
    
    function getFetch(){
      const choice = document.querySelector('input').value.replaceAll(' ', '-').replaceAll('.', '').toLowerCase()
      const url = `https://pokeapi.co/api/v2/pokemon/${choice}`

      fetch(url)
          .then(res => res.json()) // parse response as JSON
          .then(data => {
            console.log(data)
            const potentialPet = new PokeInfo (data.name, data.height, data.weight, data.types, data.sprites.other["official-artwork"].front_default, data.location_area_encounters)
            potentialPet.getTypes()
            potentialPet.isItHousepet()
            

            let decision = ""
            if (potentialPet.housepet) {
                decision = `Esse Pokemon é pequeno, leve e não é perigoso. Pode ser um ótimo bichinho de estimacão para o Dudu!`
                potentialPet.encounterInfo()
                document.getElementById('locations').innerText = ""
            } else {
                decision = `Esse Pokemon não é um bom bichinho para o Dudu porque ${potentialPet.reason.join(" e ")}.`
            }
            document.querySelector('.result').innerText = decision

            document.querySelector('.imagePokemon').src = potentialPet.image
            })
          .catch(err => {
              console.log(`error ${err}`)
          });
    }
    
    class Poke {
        constructor (name, height, weight, types, image) {
            this.name = name
            this.height = height
            this.weight = weight
            this.types = types
            this.image = image
            this.housepet = true
            this.reason = []
            this.typeList = []
        }

// to get the type and assign them to an array
    getTypes() {
        for (const property of this.types) {
            this.typeList.push(property.type.name)
        }
        console.log(this.typeList)
    }

    // to convert the units from decimeter used by the API to pounds
    weightToPounds (weight) {
        return Math.round((weight/4.536)*100)/100 //to get two decimals
    }

    // to convert the units of the API to feet
    heightToFeet(height) {
        return Math.round((height/3.048)*100)/100
    }

    // calculation to check if it's a good housepet
    isItHousepet() {
        // check height, weight, and types 
    let badTypes = ["fire", "electric", "poison"]
    if (this.weightToPounds(this.weight) > 400) {
        this.reason.push(`é muito pesado, com ${this.weightToPounds(this.weight)} libras`)
        this.housepet = false
    }
    if (this.heightToFeet(this.height) > 7) {
        this.reason.push(`é muito alto, com ${this.heightToFeet(this.height)} pés`)
        this.housepet = false
    }
    // to check if the type is dangerous or not: 
    if (badTypes.some(r => this.typeList.indexOf(r) >= 0)) {
        this.reason.push("é perigoso")
        this.housepet = false
    }
    }
    }

    // new class for location, supersedes previous class. "super" allows to bring all previous properties, then extend to set location, that's also a URL on the API. 
    class PokeInfo extends Poke {
        constructor (name, height, weight, types, image, location) {
            super(name, height, weight, types, image)
            this.locationURL = location
            this.locationList = []
            this.locationString = ""
        }

        encounterInfo() {
            fetch(this.locationURL)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                for (const item of data) {
                    // to get each location name
                    this.locationList.push(item.location_area.name)
                }
                // let target = document.getElementById('locations')
                target.innerText = this.locationCleanup()
            })
            .catch(err => {
                console.log(`error ${err}`)
            })
        }
        // method to clean the way location is displayed. only 5 first locations will be displayed. 
        // must delete location
        locationCleanup() {
            const words = this.locationList.slice(0, 5).join(', ').replaceAll('-', ' ').split(' ')
            for (let i = 0; i < words.length; i++) {
                words[i] = words[i][0].toUpperCase() + words[i].slice(1)
            }

            console.log(this.locationList)
            return words.join(' ')
        }
    }
    
