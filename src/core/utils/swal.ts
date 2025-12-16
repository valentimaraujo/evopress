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

