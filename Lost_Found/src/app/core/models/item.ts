export interface Item {
name: string;
  description: string;
  location: string;
  finderName: string;
  dateFound: Date;
  photo?: string; 
  claimed?: boolean;
}
