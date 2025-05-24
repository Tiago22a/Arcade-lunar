using System.ComponentModel.DataAnnotations;
using back_end.Models;
using Microsoft.EntityFrameworkCore;

namespace back_end.DTOs;

public class ShowOrderDto
{
    public int Id { get; set; }
    public string MercadoPagoPreferenceId { get; set; }
}