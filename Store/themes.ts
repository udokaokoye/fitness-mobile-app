
export type Theme = {
  lighterBackground:string;
  background: string;
  background2: string;
  text: string;
  lighterText: string;
  accentColor : string
};

export const blackTheme: Theme = {
    lighterBackground: '#34383f',
    background : '#17191C',
    background2: "#0e0f11",
    text: 'white',
    lighterText: '#b3b3b3',
    accentColor: '#EA3B46'
    // Add other styling properties here
  };

  export const lightTheme: Theme = {
    lighterBackground: '#fff',
    background : '#FFFFFF',
    background2: "#F3F9FE",
    text: '#314F79',
    // text: '#0F3262',
    lighterText: '#ABB6C2',
    accentColor: '#238BFE'
    // Add other styling properties here
  };