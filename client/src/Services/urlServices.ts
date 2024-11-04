import httpClient from "./httpClient";

import { getAuthUser } from "../util/useAuth";
import { UrlPayloadType, UrlType, } from "../types";

export const createUrl = async (payload: UrlPayloadType) => {
  try {
    const { data } = await httpClient.post("url", payload);
    return data;
  } catch (error) {
    //TODO error handling and showing error to UI
    console.log(error);
    return error;
  }
};

export const getUrlsForUser = async (): Promise<Array<UrlType> | any> => {
  const userId = getAuthUser()?.id;
  try {
    const { data } = await httpClient.get(`url/user/${userId}`);
    return data;
  } catch (error) {
    //TODO error handling and showing error to UI
    console.log(error);
    return error;
  }
};

export const deleteUrlByUrlCode = async (urlCode: string) => {
  try {
    const { data } = await httpClient.delete(`url/${urlCode}`);
    return data;
  } catch (error) {
    //TODO error handling and showing error to UI
    console.log(error);
    return error;
  }
};

export const updateUrlCode = async (payload: Partial<UrlType>) => {
  try {
    const { data } = await httpClient.put(`url/${payload.urlCode}`, payload);
    return data;
  } catch (error) {
    //TODO error handling and showing error to UI
    console.log(error);
    return error;
  }
};

export const encurtarUrl = async (urlOriginal: string): Promise<{ shortUrl: string; urlCode: string }> => {
  try {
    // Verifica se o usuário está logado
    const user = getAuthUser(); 
    if (user) {
      // Se estiver logado, chama a função createUrl
      const payload: UrlPayloadType = { 
        originalLink: urlOriginal, 
        userId: user.id 
      };
      const { shortUrl, urlCode } = await createUrl(payload);
      return { shortUrl, urlCode };
    } else {
      // Se não estiver logado, encurta a URL sem salvar no banco de dados
      const { data } = await httpClient.post("url/", { originalLink: urlOriginal }); 
      return { shortUrl: data.shortUrl, urlCode: data.urlCode }; // Retorna o objeto com shortUrl e urlCode
    }
  } catch (error) {
    console.log(error);
    throw error; // Lança o erro para que possa ser tratado na página Home
  }
};