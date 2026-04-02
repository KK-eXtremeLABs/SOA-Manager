import { FormGroup } from '@angular/forms';
import { format } from 'date-fns';
import { Helpers } from './helpers';

export class CleanFilter {
  private SearchForm!: FormGroup;
  private filter: any = {};

  constructor(SearchForm: FormGroup | object | null = null) {
    if (SearchForm instanceof FormGroup) {
      this.SearchForm = SearchForm;
      this.filter = Helpers.cloneObj(this.SearchForm.getRawValue());
    } else if (SearchForm) {
      this.filter = Helpers.cloneObj(SearchForm);
    }
    if (!Helpers.empty(this.filter)) {
      this.clean();
    }
  }

  form(searchForm: FormGroup): this {
    this.SearchForm = searchForm;
    this.clean();
    return this;
  }

  json(json: object): this {
    this.filter = json;
    this.clean();
    return this;
  }

  getFilter(): any {
    return this.filter;
  }

  private clean(): any {
    if (!Helpers.empty(this.filter.where)) {
      this.filter.where = this.cleanWhere(this.filter.where);
      if (Helpers.empty(this.filter.where)) {
        delete this.filter.where;
      }
    }
    return this.filter;
  }

  private cleanWhere(where: any): any {
    if (where) {
      if (where.and) {
        where.and = this.cleanWhereGroup(where.and);
        if (Helpers.empty(where.and)) {
          delete where.and;
        }
      }

      if (where.or) {
        where.or = this.cleanWhereGroup(where.or);
        if (Helpers.empty(where.or)) {
          delete where.or;
        }
      }

      if (Helpers.empty(where.wildcard) || where.wildcard?.value === '') {
        delete where.wildcard;
      }

      if (Helpers.empty(where.value)) {
        delete where.field;
        delete where.value;
        delete where.displayValue;
        delete where.operator;
        delete where.sub_operator;
      }
    }

    return !Helpers.empty(where) ? where : null;
  }

  private cleanWhereGroup(group: any[]): any[] | null {
    let cleanGroup = group.filter((e: any) => {
      const isOr = e.or
        ? !Helpers.empty(this.cleanWhereGroup(e.or))
        : false;
      const isAnd = e.and
        ? !Helpers.empty(this.cleanWhereGroup(e.and))
        : false;

      if (typeof e.value === 'object') {
        return this.cleanWhere(e.value) || isOr || isAnd;
      } else if (isOr || isAnd) {
        return true;
      } else if (
        e.value !== '' &&
        (e.value !== null || e.operator === 'null') &&
        e.value !== undefined
      ) {
        return true;
      }
      return false;
    });

    cleanGroup = this.formatValue(cleanGroup);
    return !Helpers.empty(cleanGroup) ? cleanGroup : null;
  }

  private formatValue(cleanGroup: any[]): any[] {
    cleanGroup.forEach((e: any) => {
      if (
        (typeof e.value !== 'object' || e.value instanceof Array) &&
        !Helpers.empty(e.dataType)
      ) {
        const DATE_FMT = 'yyyy-MM-dd';
        const DATETIME_FMT = 'yyyy-MM-dd HH:mm:ss';

        switch (e.dataType) {
          case 'date':
            if (typeof e.value === 'string') {
              e.value = format(new Date(e.value), DATE_FMT);
            } else if (Array.isArray(e.value)) {
              if (e.operator === 'between') {
                e.value[0] = format(new Date(e.value[0]), DATE_FMT);
                e.value[1] = !Helpers.empty(e.value[1])
                  ? format(new Date(e.value[1]), DATE_FMT)
                  : format(new Date(e.value[0]), DATE_FMT);
              } else {
                e.value = e.value.map((v: string) =>
                  format(new Date(v), DATE_FMT)
                );
              }
            }
            break;
          case 'datetime':
            if (typeof e.value === 'string') {
              e.value = format(new Date(e.value), DATETIME_FMT);
            } else if (Array.isArray(e.value)) {
              if (e.operator === 'between') {
                e.value[0] = format(new Date(e.value[0]), DATETIME_FMT);
                e.value[1] = !Helpers.empty(e.value[1])
                  ? format(new Date(e.value[1]), DATE_FMT) + ' 23:59:59'
                  : format(new Date(e.value[0]), DATE_FMT) + ' 23:59:59';
              } else {
                e.value = e.value.map((v: string) =>
                  format(new Date(v), DATETIME_FMT)
                );
              }
            }
            break;
        }
      }
    });
    return cleanGroup;
  }
}
