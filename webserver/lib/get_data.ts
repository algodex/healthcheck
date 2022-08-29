import axios from 'axios';


export interface FileSystemStatus {
  file_system: string,
  size: string,
  used: string,
  available: string,
  use_percent: string,
  mounted_on: string
}

export interface StatusData {
  _id: string,
  _rev: string,
  external_ipaddr: string,
  hostname: string,
  datetime: string,
  unix_time: number,
  server_name: string,
  filesystem_status: Array<FileSystemStatus>
}

export async function getData() {
  const url = '/data'
  const data:Array<StatusData> = (await axios.get(url)).data;
  console.log(JSON.stringify(data));
  const retdata:Array<StatusData> = [];

  data.forEach(server => {
    server.filesystem_status.forEach(filesystem => {
      const entry = {...server};
      entry.filesystem_status = [ filesystem ];
      retdata.push(entry);
    });
  });

  return retdata;
}