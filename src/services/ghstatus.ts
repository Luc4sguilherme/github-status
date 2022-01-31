import axios from 'axios'

const status = axios.create({
  baseURL: "https://www.githubstatus.com",
  headers: {
    'accept': 'application/json'
}
})

export { status }