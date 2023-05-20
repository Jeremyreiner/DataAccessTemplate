import {UniversityModel} from './UniversityModel';

export class Accolade {

  id: string;
  universityName: string;
  universityEmblem: string;
  graduationYear: string;
  currentlyAttending: boolean;
  degree: string;

  constructor(university?: UniversityModel) {
    this.universityName = university?.name;
    this.universityEmblem = university?.logo;
  }
}
