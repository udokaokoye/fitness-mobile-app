import AsyncStorage from "@react-native-async-storage/async-storage";
import { encode as btoa } from "base-64";
import { API_URL, APP_NAME } from '@env';

export const heightData = [
  { CM: '91', Foot: "3' 6\"" },
  { CM: '94', Foot: "3' 1\"" },
  { CM: '97', Foot: "3' 2\"" },
  { CM: '99', Foot: "3' 3\"" },
  { CM: '102', Foot: "3' 4\"" },
  { CM: '104', Foot: "3' 5\"" },
  { CM: '107', Foot: "3' 6\"" },
  { CM: '109', Foot: "3' 7\"" },
  { CM: '112', Foot: "3' 8\"" },
  { CM: '114', Foot: "3' 9\"" },
  { CM: '117', Foot: "3' 10\"" },
  { CM: '119', Foot: "3' 11\"" },
  { CM: '122', Foot: "4' 0\"" },
  { CM: '124', Foot: "4' 1\"" },
  { CM: '127', Foot: "4' 2\"" },
  { CM: '130', Foot: "4' 3\"" },
  { CM: '132', Foot: "4' 4\"" },
  { CM: '135', Foot: "4' 5\"" },
  { CM: '137', Foot: "4' 6\"" },
  { CM: '140', Foot: "4' 7\"" },
  { CM: '142', Foot: "4' 8\"" },
  { CM: '145', Foot: "4' 9\"" },
  { CM: '147', Foot: "4' 10\"" },
  { CM: '150', Foot: "4' 11\"" },
  { CM: '152', Foot: "5' 0\"" },
  { CM: '155', Foot: "5' 1\"" },
  { CM: '157', Foot: "5' 2\"" },
  { CM: '160', Foot: "5' 3\"" },
  { CM: '163', Foot: "5' 4\"" },
  { CM: '165', Foot: "5' 5\"" },
  { CM: '168', Foot: "5' 6\"" },
  { CM: '170', Foot: "5' 7\"" },
  { CM: '173', Foot: "5' 8\"" },
  { CM: '175', Foot: "5' 9\"" },
  { CM: '178', Foot: "5' 10\"" },
  { CM: '180', Foot: "5' 11\"" },
  { CM: '183', Foot: "6' 0\"" },
  { CM: '185', Foot: "6' 1\"" },
  { CM: '188', Foot: "6' 2\"" },
  { CM: '190', Foot: "6' 3\"" },
  { CM: '193', Foot: "6' 4\"" },
  { CM: '196', Foot: "6' 5\"" },
  { CM: '198', Foot: "6' 6\"" },
  { CM: '201', Foot: "6' 7\"" },
  { CM: '203', Foot: "6' 8\"" },
  { CM: '206', Foot: "6' 9\"" },
  { CM: '208', Foot: "6' 10\"" },
  { CM: '211', Foot: "6' 11\"" },
  { CM: '213', Foot: "7' 0\"" },
  { CM: '216', Foot: "7' 1\"" },
  { CM: '218', Foot: "7' 2\"" },
  { CM: '221', Foot: "7' 3\"" },
  { CM: '224', Foot: "7' 4\"" },
  { CM: '226', Foot: "7' 5\"" },
  { CM: '229', Foot: "7' 6\"" }
];



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

export async function updateUserAsyncStorage(user: any) {
  await AsyncStorage.setItem('user', JSON.stringify(user))
}

// converted - tested - tested
export function suggestText(
  txt: string,
  setsuggestions: any,
) {
  const formData = new FormData();
  formData.append("text", txt);
try {
  fetch(`http://${API_URL}/fitness-backend/api/proxy/index.php?function=suggestText`, {
    method: "POST",
    body: formData
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      setsuggestions(data);
    });
} catch (error) {
  console.log(error)
}
}

// converted - tested - tested
export async function searchFoodFromApi(
  txt: string,
  setsearchResults: any
) {
  const formData = new FormData();
  formData.append("text", txt);

  const response = await fetch(
    `http://${API_URL}/fitness-backend/api/proxy/index.php?function=searchFoodFromApi`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await response.json();
  // console.log(data)
  // console.log(data.foods_search?.results);
  setsearchResults(data);
}

// converted - tested - tested
export async function searchFoodByID(
  ID: string,
) {
  
  const formData = new FormData();
  formData.append("Id", ID);
  // formData.append("scope", "premier");

  const response = await fetch(
    `http://${API_URL}/fitness-backend/api/proxy/index.php?function=searchFoodByID`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await response.json();
  console.log(data)
  // console.log(data.foods_search?.results);
  return data
}

// converted - tested - tested
export async function searchFoodWithBarcode( barcode: number) {

  const formData = new FormData();
  formData.append("barcode", barcode.toString());

  const response = await fetch(
    `http://${API_URL}/fitness-backend/api/proxy/index.php?function=searchFoodWithBarcode`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await response.json();
    // const foodResult = await searchFoodByID(accessToken, foodID)
    return data
  
}

export async function saveUserSearch(searchQuery: string) {
  const userSearchHistory = await AsyncStorage.getItem('searchHistory');
  if (userSearchHistory) {
    const parsedSearchHistory = JSON.parse(userSearchHistory);

    parsedSearchHistory.map((serQuery:string, index: number) => {
      if (serQuery == searchQuery) {
        // console.log('same')
        return false;
      }
    })

    if (parsedSearchHistory.length == 5) {
      console.log('removed excess')
      parsedSearchHistory.pop(4)
    }
    parsedSearchHistory.unshift(searchQuery);
    await AsyncStorage.setItem('searchHistory', JSON.stringify(parsedSearchHistory))
    return true;
  } else {
    const newSearchHistory = [searchQuery];
    await AsyncStorage.setItem('searchHistory', JSON.stringify(newSearchHistory))
    return true;
  }
}

export async function getUserSearchHistory()  {
  // await AsyncStorage.removeItem('searchHistory')
  const userSearchHistory = await AsyncStorage.getItem('searchHistory');
  if (userSearchHistory) {
    const parsedSearchHistory = JSON.parse(userSearchHistory);
    return parsedSearchHistory;
  } else {
    return null
  }
}

export async function removeUserSearchHistory (searchQuery:string) {
  const userSearchHistory = await AsyncStorage.getItem('searchHistory');
  let toPop = null
  if (userSearchHistory) {
    const parsedSearchHistory = JSON.parse(userSearchHistory);
    parsedSearchHistory.map((serQuery:string, index: number) => {
      if (serQuery == searchQuery) {
        toPop = index
      }
    })

    if (toPop) {
      parsedSearchHistory.pop(toPop);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(parsedSearchHistory))
      // console.log('removed search query')
    } 
    return parsedSearchHistory
  } else {
    return null
  }
}






// converted - tested
// export async function getUsersAccessToken(): Promise<string> {
//   const tokenObject = await AsyncStorage.getItem("accessToken");
//   if (tokenObject === null) {
//     const newToken = await fetchUsersAccessToken();
//     return newToken;
//   }
//   const { token, expires } = JSON.parse(tokenObject);
//   // const expires = JSON.parse(tokenObject).expires;
//   if (token) {
//     const isTokenExpired = checkIfTokenExpired(expires);
//     if (isTokenExpired) {
//       const newToken = await fetchUsersAccessToken();
//       return newToken;
//     } else {
//       return token;
//     }
//   } else {
//     const newToken = await fetchUsersAccessToken();
//     return newToken;
//   }
// }

// converted - tested
// export async function fetchUsersAccessToken(): Promise<string> {
//   const clientID = process.env.CLIENT_ID;
//   const clientSecret = process.env.CLIENT_SECRET;
//   var details: any = {
//     grant_type: "client_credentials",
//     scope: "premier",
//   };

//   var formBody: any = [];
//   for (var property in details) {
//     var encodedKey = encodeURIComponent(property);
//     var encodedValue = encodeURIComponent(details[property]);
//     formBody.push(encodedKey + "=" + encodedValue);
//   }
//   formBody = formBody.join("&");
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       Authorization:
//         "Basic " +
//         btoa(
//           `44b2287776b74d1cb6ea07ed0ef0c214:64b4e70797e647e68a90e2455ebe10ff`
//         ),
//     },
//     body: formBody,
//   };

//   try {
//     const response = await fetch(
//       "https://oauth.fatsecret.com/connect/token",
//       options
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const data = await response.json();
//     const expires_in = Date.now() + 23.5 * 60 * 60 * 1000;
//     await setUsersAccessToken(data.access_token, expires_in);
//     return data.access_token;
//   } catch (error) {
//     console.error("Error:", error);
//   }
//   return "";
// }

// converted - tested
// export async function setUsersAccessToken(token: string, expires: number) {
//   const tokenObject = JSON.stringify({
//     token,
//     expires: expires,
//   });
//   await AsyncStorage.setItem("accessToken", tokenObject);
// }
// converted - tested
// export function checkIfTokenExpired(expires: number): boolean {
//   const now = Date.now();
//   if (now > expires) {
//     return true;
//   }
//   return false;
// }

// converted - tested
// export async function getUsersBarcodeAccessToken(): Promise<string> {
//   const tokenObject = await AsyncStorage.getItem("barcodeAccessToken");
//   if (tokenObject === null) {
//     const newToken = await fetchUsersBarcodeAccessToken();
//     return newToken;
//   }
//   const { token, expires } = JSON.parse(tokenObject);
//   // const expires = JSON.parse(tokenObject).expires;
//   if (token) {
//     const isTokenExpired = checkIfTokenExpired(expires);
//     if (isTokenExpired) {
//       const newToken = await fetchUsersBarcodeAccessToken();
//       return newToken;
//     } else {
//       return token;
//     }
//   } else {
//     const newToken = await fetchUsersBarcodeAccessToken();
//     return newToken;
//   }
// }

// converted - tested
// export async function fetchUsersBarcodeAccessToken(): Promise<string> {
//   const clientID = process.env.CLIENT_ID;
//   const clientSecret = process.env.CLIENT_SECRET;
//   var details: any = {
//     grant_type: "client_credentials",
//     scope: "barcode",
//   };

//   var formBody: any = [];
//   for (var property in details) {
//     var encodedKey = encodeURIComponent(property);
//     var encodedValue = encodeURIComponent(details[property]);
//     formBody.push(encodedKey + "=" + encodedValue);
//   }
//   formBody = formBody.join("&");
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       Authorization:
//         "Basic " +
//         btoa(
//           `44b2287776b74d1cb6ea07ed0ef0c214:64b4e70797e647e68a90e2455ebe10ff`
//         ),
//     },
//     body: formBody,
//   };

//   try {
//     const response = await fetch(
//       "https://oauth.fatsecret.com/connect/token",
//       options
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const data = await response.json();
//     const expires_in = Date.now() + 23.5 * 60 * 60 * 1000;
//     await setUsersBarcodeAccessToken(data.access_token, expires_in);
//     return data.access_token;
//   } catch (error) {
//     console.error("Error:", error);
//   }
//   return "";
// }

// converted - tested
// export async function setUsersBarcodeAccessToken(token: string, expires: number) {
//   const tokenObject = JSON.stringify({
//     token,
//     expires: expires,
//   });
//   await AsyncStorage.setItem("barcodeAccessToken", tokenObject);
// }

