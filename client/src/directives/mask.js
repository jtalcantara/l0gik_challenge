// Diretiva para máscara de telefone
export const mask = {
  mounted(el, binding) {
    if (binding.value === '(##) #####-####') {
      el.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length <= 11) {
          value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
          if (value.length < 14) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
          }
        }
        e.target.value = value
      })
    }
  }
}
