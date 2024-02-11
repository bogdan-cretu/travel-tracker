import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Sustan0l",
  port: 5433,
});

db.connect();

const app = express();
const port = 3000;

let allCountries = []

async function showAllCountries(){
  const result = await db.query("SELECT * FROM visited_countries")
  shortCountryName = []
  result.rows.forEach(country =>{
    shortCountryName.push(country.country_code)  
  }) 
  return shortCountryName;   
};



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let shortCountryName = []


app.get("/", async (req, res) => {
  
  const countries = await showAllCountries();

  res.render("index.ejs", {
    total : countries.length,
    countries : shortCountryName,
  })
});

app.post("/add", async (req, res)=>{
  const userInputCountryName = req.body.country
  console.log(req.body.country);
  try {
    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)",[userInputCountryName])
  showAllCountries()
  res.redirect("/");
  } catch (error) {
    const countries = await showAllCountries()
    res.render("index.ejs",{
      total : countries.length,
      countries : shortCountryName,
      error : "Country already exists, please try a different one"
    })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
