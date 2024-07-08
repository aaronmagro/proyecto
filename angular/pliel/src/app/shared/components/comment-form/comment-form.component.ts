import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MainLoaderComponent } from '../loaders/main-loader/main-loader.component';

/**
 * Componente para el formulario de comentarios.
 * Permite a los usuarios añadir comentarios a un libro específico.
 */
@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MainLoaderComponent,
  ],
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent {
  @Input() bookId: number = 0; // ID del libro al que se añade el comentario
  @Input() parentId: number | null = null; // ID del comentario padre (si es una respuesta)
  commentForm: FormGroup; // Formulario reactivo para el comentario

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private autenticacionService: AutenticacionService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    this.commentForm = this.fb.group({
      comment_content: ['', Validators.required]
    });
  }

  /**
   * Método que se ejecuta al enviar el formulario.
   * Verifica si el formulario es válido y si el usuario ha iniciado sesión antes de enviar el comentario.
   */
  onSubmit(): void {
    if (this.commentForm.valid) {
      const commentData = {
        comment_content: this.commentForm.value.comment_content,
        parent_id: this.parentId
      };
      if (this.autenticacionService.isSesionIniciada()) {
        this.commentService.addComment(this.bookId, commentData).subscribe(() => {
          this.commentForm.reset();
          this.notificationService.showSuccess(this.translate.instant('NOTIFICATIONS.COMMENT_FORM.COMMENT_SENT'), '');
        });
      } else {
        this.notificationService.showError(this.translate.instant('NOTIFICATIONS.COMMENT_FORM.LOGIN_REQUIRED'), '');
      }
    }
  }
}
