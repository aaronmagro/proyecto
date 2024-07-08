import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from '../../../interfaces/comment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MainLoaderComponent } from '../loaders/main-loader/main-loader.component';
import { User } from '../../../interfaces/user';

/**
 * Componente que representa un comentario individual y sus posibles respuestas.
 * Permite a los usuarios responder a comentarios y eliminarlos si tienen permiso.
 */
@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MainLoaderComponent
  ],
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent {
  @Input() comment!: Comment; // Recibe el comentario desde el componente padre
  @Output() commentDeleted = new EventEmitter<number>(); // Emite un evento cuando un comentario es eliminado
  showReplyForm: boolean = false; // Bandera para mostrar/ocultar el formulario de respuesta
  showReplies: boolean = false; // Bandera para mostrar/ocultar las respuestas
  replyForm: FormGroup; // Formulario reactivo para la respuesta
  currentUser: User | null = null; // Usuario actualmente autenticado

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private autenticacionService: AutenticacionService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    // Inicializa el formulario de respuesta
    this.replyForm = this.fb.group({
      comment_content: ['', Validators.required]
    });
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga los datos del usuario actual.
   */
  ngOnInit(): void {
    this.autenticacionService.getDatosUsuario().subscribe(user => {
      this.currentUser = user;
    });
  }

  /**
   * Método para alternar la visibilidad del formulario de respuesta.
   */
  toggleReplyForm(): void {
    this.showReplyForm = !this.showReplyForm;
  }

  /**
   * Método para alternar la visibilidad de las respuestas.
   */
  toggleReplies(): void {
    this.showReplies = !this.showReplies;
  }

  /**
   * Método para verificar si el usuario actual puede eliminar el comentario.
   * @returns booleano indicando si el usuario puede eliminar el comentario.
   */
  canDeleteComment(): boolean {
    if (!this.autenticacionService.isSesionIniciada()) {
      return false;
    }
  
    const isCurrentUser = this.currentUser?.username === this.comment.user.username;
    const isAdmin = this.currentUser?.roles?.includes('ROLE_ADMIN');
  
    return !!isCurrentUser || !!isAdmin;
  }
  
  /**
   * Método para eliminar el comentario.
   */
  deleteComment(): void {
    this.commentService.deleteComment(this.comment.book_id, this.comment.id).subscribe(
      () => {
        this.notificationService.showSuccess(this.translate.instant('NOTIFICATIONS.COMMENT_ITEM.COMMENT_DELETED'), '');
        this.commentDeleted.emit(this.comment.id);
      },
      error => {
        this.notificationService.showError(this.translate.instant('NOTIFICATIONS.COMMENT_ITEM.DELETE_ERROR'), '');
      }
    );
  }

  /**
   * Método que se ejecuta al enviar el formulario de respuesta.
   */
  onSubmitReply(): void {
    if (this.replyForm.valid) {
      const replyData = {
        comment_content: this.replyForm.value.comment_content,
        parent_id: this.comment.id
      };
      if (this.autenticacionService.isSesionIniciada()) {
        this.commentService.addComment(this.comment.book_id, replyData).subscribe(() => {
          this.replyForm.reset();
          this.showReplyForm = false;
          this.notificationService.showSuccess(this.translate.instant('NOTIFICATIONS.COMMENT_ITEM.REPLY_SENT'), '');
        });
      } else {
        this.notificationService.showError(this.translate.instant('NOTIFICATIONS.COMMENT_ITEM.LOGIN_REQUIRED'), '');
      }
    }
  }
}
