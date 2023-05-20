export interface Emoji {
  totals: number;
  results?: (ResultsEntity)[] | null;
}
export interface ResultsEntity {
  id: number;
  name: string;
  emoji: string;
  unicode: string;
  version: string;
  category: CategoryOrSubCategory;
  sub_category: CategoryOrSubCategory;
  children?: (null)[] | null;
}
export interface CategoryOrSubCategory {
  id: number;
  name: string;
}
