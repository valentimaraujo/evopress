import Swal from 'sweetalert2';

export async function showError(message: string, title = 'Erro') {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'OK',
  });
}

export async function showSuccess(message: string, title = 'Sucesso') {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    confirmButtonText: 'OK',
  });
}

export async function showWarning(message: string, title = 'Atenção') {
  return Swal.fire({
    icon: 'warning',
    title,
    text: message,
    confirmButtonText: 'OK',
  });
}

export async function showInfo(message: string, title = 'Informação') {
  return Swal.fire({
    icon: 'info',
    title,
    text: message,
    confirmButtonText: 'OK',
  });
}

export async function showConfirmDelete(postTitle: string) {
  return Swal.fire({
    icon: 'warning',
    title: 'Confirmar exclusão',
    html: `Tem certeza que deseja excluir o post <strong>"${postTitle}"</strong>?<br><br>Esta ` +
     `ação não pode ser desfeita.`,
    showCancelButton: true,
    confirmButtonText: 'Excluir',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  });
}

