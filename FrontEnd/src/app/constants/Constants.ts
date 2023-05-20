export class Constants {

    static readonly guidNull = '00000000-0000-0000-0000-000000000000';
    static readonly cloudinaryUrl = 'https://dwulgoypl.mo.cloudinary.net/';
    static readonly colors = [
      ['#464FE5', '#6b73ff'],
      ['#E6AF5E','#f5c074'],
      ['#3C9DE5','#66b6ef'],
      ['#9B53E6','#b881f6']
    ];

    static guidNotEmpty(guid: string) {
      return guid !== Constants.guidNull && guid !== null && guid !== undefined && guid.length;
    }

    static parseMetaData(metaData: string) {
      return JSON.parse(metaData);
    }

  // first color is normal state second color is hover color

}


