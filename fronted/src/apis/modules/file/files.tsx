import { request } from "@/utils";
import { AxiosResponse } from "axios";
import { PublicFile } from "./files.d";

const getPublicFileInfo = async (pageNo:number, pageSize:number): Promise<AxiosResponse<PublicFile>> => 
{
  console.log("ready for request");
  const response = await request.post("v1/files/query",{
    pageNo: pageNo,
    pageSize: pageSize
  });
  console.log("requets!!!")
  return response; 
};

export {
    getPublicFileInfo
}