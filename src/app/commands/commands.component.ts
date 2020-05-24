import { Component, OnInit, ViewChild } from '@angular/core';
import { CommandsService } from '../services/commands.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit {
  displayedColumns: string[] = ['usage', 'module', 'summary', 'permission'];
  dataSource = new MatTableDataSource();
  commands: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: CommandsService) {}

  async ngOnInit() { 
    this.commands = this.service.commands;
    
    this.dataSource = new MatTableDataSource(this.commands);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;    

    document.title = '2PG - Commands';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage();
  }
}
