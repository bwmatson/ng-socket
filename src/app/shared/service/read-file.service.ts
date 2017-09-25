import { Observable } from 'rxjs/Observable';

export abstract class ReadFileService {
  public static loadJSON(file: string): Observable<string> {
    return Observable.create(observer => {
      const xobj = new XMLHttpRequest();
      xobj.overrideMimeType('application/json');
      xobj.open('GET', file, true);
      xobj.onreadystatechange = () => {
        if (xobj.readyState === 4 && xobj.status === 200) {
          observer.next(xobj.responseText);
        }
      };
      xobj.send(null);
    });
  }
}
