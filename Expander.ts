
export class QGramExpander {
  constructor() {
  }

  expand(record: string): string[] {
    return [record];

    /* TODO
    let q = 3; // TODO: Should be a parameter
    let qgrams: string[] = [];
    for (let i = 0; i < record.length - q; i++) {
      qgrams.push(record.substring(i, i + q));
    }
    return qgrams; */
  }
}

export class DateExpander {
  constructor() {
  }

  expand(date: Date): string[] {
    const dayBefore = new Date(date);
    dayBefore.setDate(dayBefore.getDate() - 1);

    const dayAfter = new Date(date);
    dayAfter.setDate(dayBefore.getDate() + 1);

    const dates = [date, dayBefore, dayAfter];
    return dates.map(this.formatDate);
  }

  formatDate(date: Date): string {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    return y + '-' + ('0' + m).slice(-2) + '-' + ('0' + d).slice(-2);
  }
}
