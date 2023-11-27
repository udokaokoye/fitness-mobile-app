import AsyncStorage from "@react-native-async-storage/async-storage";
import { encode as btoa } from "base-64";

export async function isUserLoggedIn() {
  const user = await AsyncStorage.getItem('user');

  if (user) {
    return user
  } else {
    return null
  }
}

export async function logUserOut() {
  await AsyncStorage.removeItem('user')
}


export async function getUsersAccessToken(): Promise<string> {
  const tokenObject = await AsyncStorage.getItem("accessToken");
  if (tokenObject === null) {
    const newToken = await fetchUsersAccessToken();
    return newToken;
  }
  const { token, expires } = JSON.parse(tokenObject);
  // const expires = JSON.parse(tokenObject).expires;
  if (token) {
    const isTokenExpired = checkIfTokenExpired(expires);
    if (isTokenExpired) {
      const newToken = await fetchUsersAccessToken();
      return newToken;
    } else {
      return token;
    }
  } else {
    const newToken = await fetchUsersAccessToken();
    return newToken;
  }
}

export async function fetchUsersAccessToken(): Promise<string> {
  const clientID = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  var details: any = {
    grant_type: "client_credentials",
    scope: "premier",
  };

  var formBody: any = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        btoa(
          `44b2287776b74d1cb6ea07ed0ef0c214:64b4e70797e647e68a90e2455ebe10ff`
        ),
    },
    body: formBody,
  };

  try {
    const response = await fetch(
      "https://oauth.fatsecret.com/connect/token",
      options
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const expires_in = Date.now() + 23.5 * 60 * 60 * 1000;
    await setUsersAccessToken(data.access_token, expires_in);
    return data.access_token;
  } catch (error) {
    console.error("Error:", error);
  }
  return "";
}

export async function setUsersAccessToken(token: string, expires: number) {
  const tokenObject = JSON.stringify({
    token,
    expires: expires,
  });
  await AsyncStorage.setItem("accessToken", tokenObject);
}
export function checkIfTokenExpired(expires: number): boolean {
  const now = Date.now();
  if (now > expires) {
    return true;
  }
  return false;
}

export function suggestText(
  txt: string,
  setsuggestions: any,
  accessToken: string
) {
  const formData = new FormData();
  formData.append("method", "foods.autocomplete.v2");
  formData.append("expression", txt);
  formData.append("max_result", "3");
  formData.append("format", "json");
  formData.append("scope", "premier");
try {
  fetch("https://platform.fatsecret.com/rest/server.api", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData
  })
    .then((res) => res.json())
    .then((data) => {
      setsuggestions(data.suggestions?.suggestion);
    });
} catch (error) {
  console.log(error)
}
}

export async function searchFoodFromApi(
  accessToken: string,
  txt: string,
  setsearchResults: any
) {
  const formData = new FormData();
  formData.append("method", "foods.search.v2");
  formData.append("search_expression", txt);
  formData.append("max_result", "5");
  formData.append("format", "json");
  formData.append("scope", "premier");

  const response = await fetch(
    "https://platform.fatsecret.com/rest/server.api",
    {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );
  const data = await response.json();
  // console.log(data.foods_search?.results);
  setsearchResults(data.foods_search?.results);
}

export async function searchFoodByID(
  ID: string,
  accessToken?: string,
) {
  let token = !accessToken ? await getUsersAccessToken() : accessToken
  const formData = new FormData();
  formData.append("method", "food.get.v3");
  formData.append("food_id", ID);
  formData.append("format", "json");
  // formData.append("scope", "premier");

  const response = await fetch(
    "https://platform.fatsecret.com/rest/server.api",
    {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );
  const data = await response.json();
  // console.log(data)
  // console.log(data.foods_search?.results);
  return data?.food
}

export async function searchFoodWithBarcode(accessToken:string, barcode: number) {
  const barcodeAccessToken = await getUsersBarcodeAccessToken()
  const formData = new FormData();
  formData.append("method", "food.find_id_for_barcode");
  formData.append("barcode", barcode.toString());
  // formData.append("max_result", "5");
  formData.append("format", "json");
  formData.append("scope", "barcode");

  const response = await fetch(
    "https://platform.fatsecret.com/rest/server.api",
    {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${barcodeAccessToken}`,
      },
      body: formData,
    }
  );
  const data = await response.json();
  const foodID = data.food_id.value
  if (foodID == "0") {
    return null
  } else {
    // const foodResult = await searchFoodByID(accessToken, foodID)
    // // console.log(foodResult) 
    return foodID
  }
}




export async function getUsersBarcodeAccessToken(): Promise<string> {
  const tokenObject = await AsyncStorage.getItem("barcodeAccessToken");
  if (tokenObject === null) {
    const newToken = await fetchUsersBarcodeAccessToken();
    return newToken;
  }
  const { token, expires } = JSON.parse(tokenObject);
  // const expires = JSON.parse(tokenObject).expires;
  if (token) {
    const isTokenExpired = checkIfTokenExpired(expires);
    if (isTokenExpired) {
      const newToken = await fetchUsersBarcodeAccessToken();
      return newToken;
    } else {
      return token;
    }
  } else {
    const newToken = await fetchUsersBarcodeAccessToken();
    return newToken;
  }
}

export async function fetchUsersBarcodeAccessToken(): Promise<string> {
  const clientID = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  var details: any = {
    grant_type: "client_credentials",
    scope: "barcode",
  };

  var formBody: any = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        btoa(
          `44b2287776b74d1cb6ea07ed0ef0c214:64b4e70797e647e68a90e2455ebe10ff`
        ),
    },
    body: formBody,
  };

  try {
    const response = await fetch(
      "https://oauth.fatsecret.com/connect/token",
      options
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const expires_in = Date.now() + 23.5 * 60 * 60 * 1000;
    await setUsersBarcodeAccessToken(data.access_token, expires_in);
    return data.access_token;
  } catch (error) {
    console.error("Error:", error);
  }
  return "";
}

export async function setUsersBarcodeAccessToken(token: string, expires: number) {
  const tokenObject = JSON.stringify({
    token,
    expires: expires,
  });
  await AsyncStorage.setItem("barcodeAccessToken", tokenObject);
}