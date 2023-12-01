import { Theme } from "../Store/themes";

export interface CommonThemeProp {
  theme: Theme;
}
export interface NavigationProps {
  navigation: any;
}

export interface FoodProps {
  food_id: string;
  food_name: string;
  brand_name?: string;
  food_sub_categories: {
    food_sub_category: Array<string>;
  };
  food_type: string;
  food_url: string;
  servings: {
    serving: [
      {
        calcium: string;
        calories: string;
        carbohydrate: string;
        cholesterol: string;
        fat: string;
        fiber: string;
        iron: string;
        is_default: string;
        measurement_description: string;
        metric_serving_amount: string;
        metric_serving_unit: string;
        monounsaturated_fat: string;
        number_of_units: string;
        polyunsaturated_fat: string;
        potassium: string;
        protein: string;
        saturated_fat: string;
        serving_description: string;
        serving_id: string;
        serving_url: string;
        sodium: string;
        sugar: string;
        vitamin_a: string;
        vitamin_c: string;
        vitamin_d: string;
      }
    ];
  };
}
