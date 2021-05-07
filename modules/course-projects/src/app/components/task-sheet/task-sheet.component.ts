import {Component, Input, OnInit} from '@angular/core';
import {Theme} from '../../models/theme.model';
import {ProjectThemeService} from '../../services/project-theme.service';
import {TaskSheetService} from '../../services/task-sheet.service';
import {Subscription} from 'rxjs';
import {CourseUser} from '../../models/course-user.model';
import {EditTaskSheetComponent} from './edit-task-sheet/edit-task-sheet.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {getSubjectId} from '../../store/selectors/subject.selector';
import { CoreGroup } from 'src/app/models/core-group.model';
import { Template } from 'src/app/models/template.model';

@Component({
  selector: 'app-task-sheet',
  templateUrl: './task-sheet.component.html',
  styleUrls: ['./task-sheet.component.less']
})
export class TaskSheetComponent implements OnInit {

  @Input() courseUser: CourseUser;
  @Input() groups: CoreGroup[];

  private themes: Theme[];
  private taskSheetHtml: any;
  private taskSheetSubscription: Subscription;

  private subjectId: string;
  private courseProjectId: number;
  private templates: any[];
  private tepmlate: Template;

  constructor(private projectThemeService: ProjectThemeService,
              private taskSheetService: TaskSheetService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;
      this.projectThemeService.getThemes({entity: 'CourseProject', subjectId: this.subjectId})
        .subscribe(res => {
          if (res.length > 0) {
            this.themes = res;
            if (this.courseProjectId == null) {
              this.courseProjectId = res[0].Id;
            }
            this.retrieveTaskSheetHtml();
            this.retrieveTemplates();
          }
        });
    });
  }

  onThemeChange(themeId: number) {
    this.courseProjectId = themeId;
    if (this.taskSheetSubscription) {
      this.taskSheetSubscription.unsubscribe();
    }
    this.retrieveTaskSheetHtml();
  }

  retrieveTaskSheetHtml() {
    this.taskSheetHtml = null;
    this.taskSheetSubscription = this.taskSheetService.getTaskSheetHtml({courseProjectId: this.courseProjectId})
      .subscribe(res => {
        if (res != null) {
          this.taskSheetHtml = res;
        const div = document.getElementById('task-sheet');
        div.innerHTML = res;
        }
      });
  }

  getTaskSheetTemplate(taskSheet: any): object{
    var checkTheme = this.templates.find((i) => i.InputData == taskSheet.InputData
    && i.Faculty == i.Faculty
    && i.HeadCathedra == i.HeadCathedra
    && i.RpzContent == i.RpzContent
    && i.DrawMaterials == i.DrawMaterials
    && i.Univer == i.Univer
    && i.DateEnd == i.DateEnd
    && i.DateStart == i.DateStart);

    if (checkTheme != undefined){
      this.tepmlate = new Template();
      this.tepmlate.Id = String(checkTheme.Id);
      this.tepmlate.Name = checkTheme.Name;
      return this.tepmlate;
    }
    else{
      return undefined;
    }
  }

  editTaskSheet() {
    this.taskSheetService.getTaskSheet({courseProjectId: this.courseProjectId}).subscribe(response => {
      const dialogRef = this.dialog.open(EditTaskSheetComponent, {
        width: '700px',
        data: {
          subjectId: this.subjectId,
          taskSheet: response,
          groups: this.groups,
          taskSheetTemplate: this.getTaskSheetTemplate(response),
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.taskSheetService.editTaskSheet(result).subscribe(() => {
            this.ngOnInit();
            this.snackBar.open('Лист задания успешно сохранен', null, {
              duration: 2000
            });
          });
        }
        else{
          this.ngOnInit();
        }
      });
    });
  }

  retrieveTemplates() {
    this.taskSheetService.getTemplates(
      'count=1000000' +
      '&page=1' +
      '&filter={"lecturerId":"' + this.courseUser.UserId + '","searchString":"' + '' + '"}' +
      '&filter[lecturerId]=' + this.courseUser.UserId +
      '&sorting[' + 'Id' + ']=' + 'desc'
    ).subscribe(res => this.templates = res.Items);
  }

  downloadTaskSheet() {
    location.href = location.origin + '/api/CPTaskSheetDownload?courseProjectId=' + this.courseProjectId;
  }
}
