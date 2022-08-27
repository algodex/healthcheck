import axios from 'axios';

export default async function getData() {
  const url = '/data'
  const data = (await axios.get(url)).data;
  return data;
}