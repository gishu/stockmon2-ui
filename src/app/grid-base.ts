import { ViewChild, Input } from "@angular/core";
import { MatSort, MatTableDataSource } from "@angular/material";

export abstract class GridBase {
    dataSource: any;
    displayedColumns: string[];
    @ViewChild(MatSort) sort: MatSort;

    _gridData: any[];

    _accountId: number;
    _currentFinYear: number;
    _filterString: string;
    _groupBy: string;

    private _hasViewLoaded: boolean = false;

    @Input()
    set accountId(id: number) {
        this._accountId = id;

        if (!this._hasViewLoaded) {
            return;
        }

        this.fetch();
    }
    @Input()

    set group(newGrouping: string) {
        this._groupBy = newGrouping;

        if (!this._hasViewLoaded) {
            return;
        }

        this._renderGrid();
    }
    @Input()

    set filter(filterString: string) {
        this._filterString = filterString;
        if (!this._hasViewLoaded) {
            return;
        }

        filterString = filterString.trim(); // Remove whitespace
        filterString = filterString.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterString;

        this.afterGridUpdate();
    }

    @Input()
    set isActive(state: boolean) {
        console.log('Activated = ', state);
    }

    @Input()
    set currentFinYear(year: number) {
        this._currentFinYear = year;
    }

    ngAfterViewInit() {
        this._hasViewLoaded = true;
        this.fetch();
    }

    abstract fetch(): void;
    abstract afterGridUpdate(): any ;
    abstract groupItems() : void;
    
    _renderGrid() {
        this.groupItems();
        this.afterGridUpdate()
        this.dataSource = new MatTableDataSource(this._gridData);
        if (this._hasViewLoaded) {
          this.dataSource.sort = this.sort;
        }
      }
}
