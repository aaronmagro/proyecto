import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { CommonModule } from '@angular/common';
import { CommentItemComponent } from '../comment-item/comment-item.component';
import { Comment } from '../../../interfaces/comment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ButtonSimpleComponent } from '../button-simple/button-simple.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente que muestra una lista de comentarios asociados a un libro.
 * Permite la carga incremental de comentarios y actualiza la lista cuando se añaden o eliminan comentarios.
 */
@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    CommentItemComponent,
    ButtonSimpleComponent,
    TranslateModule
  ],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  @Input() bookId!: number; // ID del libro para el que se muestran los comentarios
  comments: Comment[] = []; // Lista de todos los comentarios
  displayedComments: Comment[] = []; // Lista de comentarios que se muestran actualmente
  private commentAddedSubscription!: Subscription; // Suscripción para añadir comentarios
  public initialDisplayCount: number = 3; // Número inicial de comentarios a mostrar
  private incrementCount: number = 3; // Número de comentarios a añadir cuando se cargan más
  private subscriptions: Subscription = new Subscription(); // Gestión de suscripciones

  constructor(private commentService: CommentService) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga los comentarios y configura la suscripción para actualizarlos.
   */
  ngOnInit(): void {
    this.loadComments();
    this.commentAddedSubscription = this.commentService.commentAdded$.subscribe(() => {
      this.loadComments(); // Actualiza los comentarios cuando se añade o elimina uno
    });
    this.subscriptions.add(this.commentAddedSubscription);
  }

  /**
   * Método que se ejecuta cuando cambian las propiedades de entrada.
   * @param changes - Los cambios en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookId'] && !changes['bookId'].isFirstChange()) {
      this.loadComments();
    }
  }

  /**
   * Método que se ejecuta cuando se destruye el componente.
   * Cancela todas las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Carga los comentarios del libro desde el servicio.
   */
  loadComments(): void {
    this.commentService.getComments(this.bookId).subscribe((comments: Comment[]) => {
      this.comments = comments;
      this.displayedComments = this.comments.slice(0, this.initialDisplayCount);
    });
  }

  /**
   * Muestra más comentarios incrementando el número de comentarios visibles.
   */
  showMoreComments(): void {
    const nextCount = this.displayedComments.length + this.incrementCount;
    this.displayedComments = this.comments.slice(0, nextCount);
    this.scrollToLastComment();
  }

  /**
   * Restaura la visualización de comentarios al número inicial.
   */
  showZeroComments(): void {
    this.displayedComments = this.comments.slice(0, this.initialDisplayCount);
  }

  /**
   * Desplaza la vista al último comentario visible.
   */
  private scrollToLastComment(): void {
    setTimeout(() => {
      const lastCommentElement = document.querySelector('.comments-list li:nth-last-child(4)');
      if (lastCommentElement) {
        lastCommentElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  }

  /**
   * Elimina un comentario de la lista cuando se recibe un evento de eliminación.
   * @param commentId - El ID del comentario eliminado.
   */
  onCommentDeleted(commentId: number): void {
    this.comments = this.comments.filter(comment => comment.id !== commentId);
    this.displayedComments = this.displayedComments.filter(comment => comment.id !== commentId);
  }
 
}
